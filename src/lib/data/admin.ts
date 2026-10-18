import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { EngagementsValues } from "@/lib/validation/engagements";
import type { SocialLinksValues } from "@/lib/validation/links";
import type { ProfileValues } from "@/lib/validation/profile";
import { AVAILABILITY_MODES } from "@/lib/validation/profile";
import {
  missingByTab,
  PLATE_RATIOS,
  PROJECT_KINDS,
  PROJECT_LAYOUTS,
  type ProjectValues,
} from "@/lib/validation/projects";
import { bySortOrder } from "./localize";

// Admin reads: session client, no cache, raw FR/EN values (no fallback).
// Each one checks the admin itself, wherever it is called from.

export type ResumeInfo = { url: string | null; updatedAt: string | null };

export async function getProfileForm(): Promise<{
  values: ProfileValues;
  mediaBaseUrl: string;
}> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`profile: ${error.message}`);

  const row = data;
  const values: ProfileValues = {
    full_name: row?.full_name ?? "",
    title_fr: row?.title_fr ?? "",
    title_en: row?.title_en ?? "",
    tagline_fr: row?.tagline_fr ?? "",
    tagline_en: row?.tagline_en ?? "",
    recit_fr: row?.recit_fr ?? "",
    recit_en: row?.recit_en ?? "",
    bio_fr: row?.bio_fr ?? "",
    bio_en: row?.bio_en ?? "",
    hephaistos_fr: row?.hephaistos_fr ?? "",
    hephaistos_en: row?.hephaistos_en ?? "",
    athena_fr: row?.athena_fr ?? "",
    athena_en: row?.athena_en ?? "",
    location: row?.location ?? "",
    languages_fr: row?.languages_fr ?? "",
    languages_en: row?.languages_en ?? "",
    public_email: row?.public_email ?? "",
    is_available: row?.is_available ?? true,
    availability_modes: (row?.availability_modes ?? []).filter(
      (mode): mode is (typeof AVAILABILITY_MODES)[number] =>
        (AVAILABILITY_MODES as readonly string[]).includes(mode),
    ),
    availability_fr: row?.availability_fr ?? "",
    availability_en: row?.availability_en ?? "",
    available_from: row?.available_from ?? "",
    photo_path: row?.photo_path ?? null,
    photo_alt_fr: row?.photo_alt_fr ?? "",
    photo_alt_en: row?.photo_alt_en ?? "",
    seo_title_fr: row?.seo_title_fr ?? "",
    seo_title_en: row?.seo_title_en ?? "",
    seo_description_fr: row?.seo_description_fr ?? "",
    seo_description_en: row?.seo_description_en ?? "",
    og_image_path: row?.og_image_path ?? null,
  };

  // Public bucket: previews are built client-side from this prefix.
  const mediaBaseUrl = supabase.storage.from("media").getPublicUrl("")
    .data.publicUrl;
  return { values, mediaBaseUrl };
}

export async function getSocialLinksForm(): Promise<SocialLinksValues> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("id, platform, url")
    .order("sort_order");
  if (error) throw new Error(`social_links: ${error.message}`);
  return { links: data };
}

export async function getEngagementsForm(): Promise<EngagementsValues> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("engagements")
    .select("*, engagement_roles(label_fr, label_en, period, sort_order)")
    .order("sort_order");
  if (error) throw new Error(`engagements: ${error.message}`);

  return {
    engagements: data.map((row) => ({
      id: row.id,
      organization: row.organization,
      since: row.since ? String(row.since) : "",
      url: row.url ?? "",
      text_fr: row.text_fr,
      text_en: row.text_en,
      roles: [...row.engagement_roles]
        .sort(bySortOrder)
        .map(({ label_fr, label_en, period }) => ({
          label_fr,
          label_en,
          period,
        })),
    })),
  };
}

export async function getResumesInfo(): Promise<
  Record<"fr" | "en", ResumeInfo>
> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("locale, file_path, updated_at");
  if (error) throw new Error(`resumes: ${error.message}`);

  const info = (locale: "fr" | "en"): ResumeInfo => {
    const row = data.find((r) => r.locale === locale);
    if (!row?.file_path) return { url: null, updatedAt: null };
    return {
      url: supabase.storage.from("resumes").getPublicUrl(row.file_path).data
        .publicUrl,
      updatedAt: row.updated_at,
    };
  };
  return { fr: info("fr"), en: info("en") };
}

// Projects -------------------------------------------------------------------

const PROJECT_FORM_SELECT = `*,
  project_items(kind, text_fr, text_en, sort_order),
  project_decisions(title_fr, title_en, why_fr, why_en, tradeoff_fr, tradeoff_en, sort_order),
  project_images(id, path, kind_fr, kind_en, caption_fr, caption_en, alt_fr, alt_en, ratio, sort_order),
  project_technologies(technology_id, usage_fr, usage_en, sort_order),
  slug_redirects(old_slug, created_at)` as const;

async function getProjectRowsForAdmin(id?: string) {
  const supabase = await createClient();
  const query = supabase
    .from("projects")
    .select(PROJECT_FORM_SELECT)
    .order("sort_order")
    .order("created_at");
  const { data, error } = await (id ? query.eq("id", id) : query);
  if (error) throw new Error(`projects: ${error.message}`);
  return data;
}

type ProjectFormRow = Awaited<
  ReturnType<typeof getProjectRowsForAdmin>
>[number];

const oneOf = <T extends string>(
  list: readonly T[],
  value: string,
  fallback: T,
) => ((list as readonly string[]).includes(value) ? (value as T) : fallback);

function toProjectValues(row: ProjectFormRow): ProjectValues {
  const items = [...row.project_items].sort(bySortOrder);
  const itemsOf = (kind: "contribution" | "result") =>
    items
      .filter((it) => it.kind === kind)
      .map(({ text_fr, text_en }) => ({ text_fr, text_en }));

  return {
    status: row.status,
    slug: row.slug,
    title_fr: row.title_fr,
    title_en: row.title_en,
    short_title_fr: row.short_title_fr,
    short_title_en: row.short_title_en,
    quest_fr: row.quest_fr,
    quest_en: row.quest_en,
    charon_line_fr: row.charon_line_fr,
    charon_line_en: row.charon_line_en,
    summary_fr: row.summary_fr,
    summary_en: row.summary_en,
    context_fr: row.context_fr,
    context_en: row.context_en,
    problem_fr: row.problem_fr,
    problem_en: row.problem_en,
    kind: oneOf(PROJECT_KINDS, row.kind, "client"),
    kind_label_fr: row.kind_label_fr,
    kind_label_en: row.kind_label_en,
    layout: oneOf(PROJECT_LAYOUTS, row.layout, "split"),
    emblem: row.emblem ?? "",
    period_fr: row.period_fr,
    period_en: row.period_en,
    role_fr: row.role_fr,
    role_en: row.role_en,
    role_label_fr: row.role_label_fr,
    role_label_en: row.role_label_en,
    team_fr: row.team_fr,
    team_en: row.team_en,
    client_name: row.client_name,
    show_client: row.show_client,
    is_confidential: row.is_confidential,
    demo_url: row.demo_url ?? "",
    repo_url: row.repo_url ?? "",
    contributions: itemsOf("contribution"),
    results: itemsOf("result"),
    decisions: [...row.project_decisions].sort(bySortOrder).map((d) => ({
      title_fr: d.title_fr,
      title_en: d.title_en,
      why_fr: d.why_fr,
      why_en: d.why_en,
      tradeoff_fr: d.tradeoff_fr,
      tradeoff_en: d.tradeoff_en,
    })),
    plates: [...row.project_images].sort(bySortOrder).map((img) => ({
      id: img.id,
      path: img.path,
      kind_fr: img.kind_fr,
      kind_en: img.kind_en,
      caption_fr: img.caption_fr,
      caption_en: img.caption_en,
      alt_fr: img.alt_fr,
      alt_en: img.alt_en,
      ratio: oneOf(PLATE_RATIOS, img.ratio, "16/10"),
    })),
    technologies: [...row.project_technologies]
      .sort(bySortOrder)
      .map(({ technology_id, usage_fr, usage_en }) => ({
        technology_id,
        usage_fr,
        usage_en,
      })),
    seo_title_fr: row.seo_title_fr,
    seo_title_en: row.seo_title_en,
    seo_description_fr: row.seo_description_fr,
    seo_description_en: row.seo_description_en,
    og_image_path: row.og_image_path,
  };
}

export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  status: ProjectValues["status"];
  layout: ProjectValues["layout"];
  missing: number;
};

/** All projects (drafts included) in chart order (F-ADM-15). */
export async function getProjectsList(): Promise<ProjectListItem[]> {
  await requireAdmin();
  const rows = await getProjectRowsForAdmin();
  return rows.map((row) => {
    const values = toProjectValues(row);
    return {
      id: row.id,
      slug: row.slug,
      title: row.short_title_fr || row.title_fr,
      status: values.status,
      layout: values.layout,
      missing: Object.values(missingByTab(values)).reduce((a, b) => a + b, 0),
    };
  });
}

export async function getProjectForm(id: string): Promise<{
  values: ProjectValues;
  redirects: string[];
  mediaBaseUrl: string;
} | null> {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return null;
  const [row] = await getProjectRowsForAdmin(id);
  if (!row) return null;

  const supabase = await createClient();
  const mediaBaseUrl = supabase.storage.from("media").getPublicUrl("")
    .data.publicUrl;
  return {
    values: toProjectValues(row),
    redirects: [...row.slug_redirects]
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((r) => r.old_slug),
    mediaBaseUrl,
  };
}

export type TechnologyOption = { id: string; name: string };

/** Technologies to link to a project (created in T10). */
export async function getTechnologyOptions(): Promise<TechnologyOption[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies")
    .select("id, name")
    .order("name");
  if (error) throw new Error(`technologies: ${error.message}`);
  return data;
}
