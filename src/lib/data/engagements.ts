import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { bySortOrder, pick } from "./localize";
import { TAGS } from "./tags";
import type { Engagement } from "./types";

async function getEngagementRows() {
  "use cache";
  cacheTag(TAGS.engagements);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("engagements")
    .select("*, engagement_roles(label_fr, label_en, period, sort_order)")
    .order("sort_order");
  if (error) throw new Error(`engagements: ${error.message}`);
  return data;
}

/** Off-duty commitments (chant I, « Hors du travail »), with their roles. */
export async function getEngagements(locale: Locale): Promise<Engagement[]> {
  const rows = await getEngagementRows();
  return rows.map((row) => ({
    id: row.id,
    organization: row.organization,
    since: row.since,
    text: pick(row, "text", locale),
    url: row.url,
    roles: [...row.engagement_roles]
      .sort(bySortOrder)
      .map((role) => ({ label: pick(role, "label", locale), period: role.period })),
  }));
}
