import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { bySortOrder, pick } from "./localize";
import { TAGS } from "./tags";
import type { Experience } from "./types";

async function getExperienceRows() {
  "use cache";
  cacheTag(TAGS.experiences, TAGS.technologies);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("experiences")
    .select("*, experience_technologies(sort_order, technologies(name))")
    .order("sort_order")
    .order("start_date", { ascending: false });
  if (error) throw new Error(`experiences: ${error.message}`);
  return data;
}

/** The ports of call (logbook), most recent first unless reordered. */
export async function getExperiences(locale: Locale): Promise<Experience[]> {
  const rows = await getExperienceRows();
  return rows.map((row) => ({
    id: row.id,
    company: row.company,
    role: pick(row, "role", locale),
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    isRemote: row.is_remote,
    message: pick(row, "message", locale),
    technologies: [...row.experience_technologies]
      .sort(bySortOrder)
      .flatMap((et) => (et.technologies ? [et.technologies.name] : [])),
  }));
}
