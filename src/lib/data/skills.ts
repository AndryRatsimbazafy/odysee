import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { pick } from "./localize";
import { TAGS } from "./tags";
import type { Skill, SkillDomain } from "./types";

async function getSkillRows() {
  "use cache";
  cacheTag(TAGS.skills);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("skills")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`skills: ${error.message}`);
  return data;
}

/** Skills of both gods, in order; filter by `domain` in the chant. */
export async function getSkills(locale: Locale): Promise<Skill[]> {
  const rows = await getSkillRows();
  return rows.map((row) => ({
    id: row.id,
    domain: row.domain as SkillDomain,
    label: pick(row, "label", locale),
    description: pick(row, "description", locale),
  }));
}
