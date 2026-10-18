"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import {
  socialLinksSchema,
  type SocialLinksValues,
} from "@/lib/validation/links";
import type { SaveResult } from "@/lib/validation/shared";

/**
 * Replaces the social links with the submitted ordered list. Returns the rows
 * with their ids so the form can reset (new rows must not be inserted twice).
 */
export async function saveSocialLinks(
  input: SocialLinksValues,
): Promise<SaveResult<SocialLinksValues>> {
  await requireAdmin();
  const parsed = socialLinksSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("social_links")
    .select("id");
  if (readError) return { ok: false, error: "failed" };

  const rows = parsed.data.links.map((link, index) => ({
    id: link.id ?? crypto.randomUUID(),
    platform: link.platform,
    url: link.url,
    sort_order: index,
  }));
  const kept = new Set(rows.map((row) => row.id));
  const removed = existing.map((row) => row.id).filter((id) => !kept.has(id));

  if (rows.length) {
    const { error } = await supabase.from("social_links").upsert(rows);
    if (error) return { ok: false, error: "failed" };
  }
  if (removed.length) {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .in("id", removed);
    if (error) return { ok: false, error: "failed" };
  }

  updateTag(TAGS.socialLinks);
  return {
    ok: true,
    data: {
      links: rows.map(({ id, platform, url }) => ({ id, platform, url })),
    },
  };
}
