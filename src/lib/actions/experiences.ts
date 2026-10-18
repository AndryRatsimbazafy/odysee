"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import {
  experiencesSchema,
  type ExperiencesValues,
} from "@/lib/validation/experiences";
import type { SaveResult } from "@/lib/validation/shared";
import { replaceList } from "./replace-list";

/** Saves the ports of call in order, then rewrites their technologies. */
export async function saveExperiences(
  input: ExperiencesValues,
): Promise<SaveResult<ExperiencesValues>> {
  await requireAdmin();
  const parsed = experiencesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const list = parsed.data.experiences;
  // Once something is written, refresh the public site even if a later
  // step fails, so it never keeps serving the previous version.
  const failed = () => {
    updateTag(TAGS.experiences);
    return { ok: false, error: "failed" } as const;
  };
  const ids = await replaceList(
    supabase,
    "experiences",
    list.map((experience) => ({
      id: experience.id,
      company: experience.company,
      role_fr: experience.role_fr,
      role_en: experience.role_en,
      start_date: experience.start_date,
      end_date: experience.end_date || null,
      location: experience.location,
      is_remote: experience.is_remote,
      message_fr: experience.message_fr,
      message_en: experience.message_en,
    })),
  );
  if (!ids) return failed();

  // Links of removed experiences went with them (on delete cascade).
  if (ids.length) {
    const { error: clearError } = await supabase
      .from("experience_technologies")
      .delete()
      .in("experience_id", ids);
    if (clearError) return failed();

    const links = list.flatMap((experience, i) =>
      experience.technology_ids.map((technology_id, index) => ({
        experience_id: ids[i],
        technology_id,
        sort_order: index,
      })),
    );
    if (links.length) {
      const { error } = await supabase
        .from("experience_technologies")
        .insert(links);
      if (error) return failed();
    }
  }

  updateTag(TAGS.experiences);
  return {
    ok: true,
    data: {
      experiences: list.map((experience, i) => ({ ...experience, id: ids[i] })),
    },
  };
}
