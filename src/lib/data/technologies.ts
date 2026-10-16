import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { pick } from "./localize";
import { getProjectLinks } from "./projects";
import { TAGS } from "./tags";
import type { ProjectLink, Technology } from "./types";

async function getTechnologyRows() {
  "use cache";
  cacheTag(TAGS.technologies, TAGS.projects);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("technologies")
    .select("*, project_technologies(project_id)")
    .order("sort_order")
    .order("name");
  if (error) throw new Error(`technologies: ${error.message}`);
  return data;
}

/**
 * The arsenal, with cross-references to the published projects that used each
 * tool (computed from project_technologies, in chart order).
 */
export async function getTechnologies(locale: Locale): Promise<Technology[]> {
  const [rows, links] = await Promise.all([
    getTechnologyRows(),
    getProjectLinks(locale),
  ]);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    yearsOfUse: row.years_of_use,
    durationLabel: pick(row, "duration_label", locale),
    weapon: row.weapon,
    role: pick(row, "role", locale),
    context: pick(row, "context", locale),
    isFeatured: row.is_featured,
    projects: row.project_technologies
      .flatMap((pt) => links.get(pt.project_id) ?? [])
      .sort((a: ProjectLink, b: ProjectLink) => a.index - b.index),
  }));
}
