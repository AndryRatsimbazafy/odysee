"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import {
  newProjectSchema,
  projectOrderSchema,
  projectSchema,
  type NewProjectValues,
  type ProjectValues,
} from "@/lib/validation/projects";

type ProjectError = "invalid" | "failed" | "slugTaken";
type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: ProjectError };

const UNIQUE_VIOLATION = "23505";
const projectId = z.uuid();

// Chart order and the arsenal's cross-references both read projects.
function refreshPublicSite() {
  updateTag(TAGS.projects);
  updateTag(TAGS.technologies);
}

type Client = Awaited<ReturnType<typeof createClient>>;

/** Files of `media/projects/{id}/` not in `keep` (replaced, removed, orphaned). */
async function removeStaleImages(supabase: Client, id: string, keep: string[]) {
  const folder = `projects/${id}`;
  const { data } = await supabase.storage
    .from("media")
    .list(folder, { limit: 1000 });
  const stale = (data ?? [])
    .map((file) => `${folder}/${file.name}`)
    .filter((path) => !keep.includes(path));
  if (stale.length) await supabase.storage.from("media").remove(stale);
}

/** Creates a draft at the end of the chart, then opens its form. */
export async function createProject(
  input: NewProjectValues,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = newProjectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, sort_order: (last?.sort_order ?? -1) + 1 })
    .select("id")
    .single();
  if (error?.code === UNIQUE_VIOLATION)
    return { ok: false, error: "slugTaken" };
  if (error) return { ok: false, error: "failed" };

  // A slug taken back by a new project must no longer redirect elsewhere
  // (redirects are cached with the projects).
  await supabase
    .from("slug_redirects")
    .delete()
    .eq("old_slug", parsed.data.slug);
  updateTag(TAGS.projects);
  redirect(`/admin/projects/${data.id}`);
}

/**
 * Saves a whole project: its row, then its ordered lists. Items, decisions
 * and technologies have no outside references, so they are rewritten;
 * plates keep their ids. Not atomic (same approach as the other forms).
 */
export async function saveProject(
  id: string,
  input: ProjectValues,
): Promise<ActionResult<{ values: ProjectValues; redirects: string[] }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!projectId.safeParse(id).success || !parsed.success) {
    return { ok: false, error: "invalid" };
  }
  const {
    contributions,
    results,
    decisions,
    plates,
    technologies,
    emblem,
    demo_url,
    repo_url,
    ...columns
  } = parsed.data;

  // Images must live in this project's folder (paths come from the upload action).
  const images = [...plates.map((p) => p.path), columns.og_image_path].filter(
    (path): path is string => !!path,
  );
  if (images.some((path) => !path.startsWith(`projects/${id}/`))) {
    return { ok: false, error: "invalid" };
  }

  const supabase = await createClient();
  const confidential = columns.is_confidential;
  const { data: updated, error } = await supabase
    .from("projects")
    .update({
      ...columns,
      emblem: emblem || null,
      is_associative: columns.kind === "associative",
      // A sealed dossier publishes no links, even through the API.
      demo_url: confidential ? null : demo_url || null,
      repo_url: confidential ? null : repo_url || null,
    })
    .eq("id", id)
    .select("id");
  if (error?.code === UNIQUE_VIOLATION)
    return { ok: false, error: "slugTaken" };
  if (error || !updated.length) return { ok: false, error: "failed" };

  // From here on the row has changed: refresh the public site even if a
  // later step fails, so it never keeps serving the previous version.
  const failed = () => {
    refreshPublicSite();
    return { ok: false, error: "failed" } as const;
  };

  // The trigger records the old slug; a slug owned elsewhere stops redirecting.
  await supabase
    .from("slug_redirects")
    .delete()
    .eq("old_slug", columns.slug)
    .neq("project_id", id);

  const clear = (
    table: "project_items" | "project_decisions" | "project_technologies",
  ) => supabase.from(table).delete().eq("project_id", id);
  const cleared = await Promise.all([
    clear("project_items"),
    clear("project_decisions"),
    clear("project_technologies"),
  ]);
  if (cleared.some((r) => r.error)) return failed();

  const ordered = <T extends object>(rows: T[]) =>
    rows.map((row, index) => ({ ...row, project_id: id, sort_order: index }));
  const items = [
    ...contributions.map((it) => ({ ...it, kind: "contribution" })),
    ...results.map((it) => ({ ...it, kind: "result" })),
  ];
  const inserted = await Promise.all([
    items.length && supabase.from("project_items").insert(ordered(items)),
    decisions.length &&
      supabase.from("project_decisions").insert(ordered(decisions)),
    technologies.length &&
      supabase.from("project_technologies").insert(ordered(technologies)),
  ]);
  if (inserted.some((r) => r && r.error)) return failed();

  // Plates: upsert by id, then drop the removed ones.
  const { data: existing, error: readError } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", id);
  if (readError) return failed();
  const owned = new Set(existing.map((row) => row.id));
  const savedPlates = plates.map((plate) => ({
    ...plate,
    id: plate.id && owned.has(plate.id) ? plate.id : crypto.randomUUID(),
  }));
  const kept = new Set(savedPlates.map((plate) => plate.id));
  const removed = [...owned].filter((plateId) => !kept.has(plateId));

  if (savedPlates.length) {
    const { error: plateError } = await supabase.from("project_images").upsert(
      savedPlates.map((plate, index) => ({
        ...plate,
        project_id: id,
        sort_order: index,
      })),
    );
    if (plateError) return failed();
  }
  if (removed.length) {
    const { error: removeError } = await supabase
      .from("project_images")
      .delete()
      .in("id", removed);
    if (removeError) return failed();
  }

  await removeStaleImages(supabase, id, images);

  const { data: redirects } = await supabase
    .from("slug_redirects")
    .select("old_slug")
    .eq("project_id", id)
    .order("created_at");

  refreshPublicSite();
  return {
    ok: true,
    data: {
      values: { ...parsed.data, plates: savedPlates },
      redirects: (redirects ?? []).map((r) => r.old_slug),
    },
  };
}

/** Saves the chart order (F-ADM-15): position in the list = sort_order. */
export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectOrderSchema.safeParse(ids);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const updates = await Promise.all(
    parsed.data.map((id, index) =>
      supabase.from("projects").update({ sort_order: index }).eq("id", id),
    ),
  );
  // Some rows may have moved even if others failed.
  refreshPublicSite();
  if (updates.some((u) => u.error)) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}

/** Deletes a project, its lists (on delete cascade) and its images. */
export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!projectId.safeParse(id).success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: "failed" };
  await removeStaleImages(supabase, id, []);

  refreshPublicSite();
  redirect("/admin/projects");
}

/** Stops an old slug from redirecting to this project (SEO-10). */
export async function deleteSlugRedirect(
  id: string,
  oldSlug: string,
): Promise<ActionResult> {
  await requireAdmin();
  if (!projectId.safeParse(id).success || !oldSlug) {
    return { ok: false, error: "invalid" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("slug_redirects")
    .delete()
    .eq("project_id", id)
    .eq("old_slug", oldSlug);
  if (error) return { ok: false, error: "failed" };

  refreshPublicSite();
  return { ok: true, data: undefined };
}
