"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import type { SaveResult } from "@/lib/validation/shared";
import { skillsSchema, type SkillsValues } from "@/lib/validation/skills";
import { replaceList } from "./replace-list";

/** Saves both gods' skills; the order counts within each domain. */
export async function saveSkills(
  input: SkillsValues,
): Promise<SaveResult<SkillsValues>> {
  await requireAdmin();
  const parsed = skillsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const { hephaistos, athena } = parsed.data;
  const supabase = await createClient();
  const ids = await replaceList(supabase, "skills", [
    ...hephaistos.map((skill) => ({ ...skill, domain: "hephaistos" })),
    ...athena.map((skill) => ({ ...skill, domain: "athena" })),
  ]);
  if (!ids) return { ok: false, error: "failed" };

  updateTag(TAGS.skills);
  return {
    ok: true,
    data: {
      hephaistos: hephaistos.map((skill, i) => ({ ...skill, id: ids[i] })),
      athena: athena.map((skill, i) => ({
        ...skill,
        id: ids[hephaistos.length + i],
      })),
    },
  };
}
