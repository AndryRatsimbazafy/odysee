"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import type { SaveResult } from "@/lib/validation/shared";
import {
  technologiesSchema,
  type TechnologiesValues,
} from "@/lib/validation/technologies";
import { replaceList } from "./replace-list";

/**
 * Saves the arsenal in order. A removed technology also leaves the projects
 * and ports of call that used it (on delete cascade).
 */
export async function saveTechnologies(
  input: TechnologiesValues,
): Promise<SaveResult<TechnologiesValues>> {
  await requireAdmin();
  const parsed = technologiesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const list = parsed.data.technologies;
  const ids = await replaceList(
    supabase,
    "technologies",
    list.map((tech) => ({
      ...tech,
      years_of_use: tech.years_of_use
        ? Number(tech.years_of_use.replace(",", "."))
        : null,
      weapon: tech.weapon || null,
    })),
  );
  // Invalidate even on failure: replaceList may have written part of it.
  // Project and arsenal reads are tagged with both.
  updateTag(TAGS.technologies);
  if (!ids) return { ok: false, error: "failed" };
  return {
    ok: true,
    data: { technologies: list.map((tech, i) => ({ ...tech, id: ids[i] })) },
  };
}
