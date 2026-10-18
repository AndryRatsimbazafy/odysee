"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import {
  engagementsSchema,
  type EngagementsValues,
} from "@/lib/validation/engagements";
import type { SaveResult } from "@/lib/validation/shared";

/**
 * Replaces the engagements (Rotaract…) and their roles with the submitted
 * ordered list. Roles have no outside references, so they are rewritten.
 */
export async function saveEngagements(
  input: EngagementsValues,
): Promise<SaveResult<EngagementsValues>> {
  await requireAdmin();
  const parsed = engagementsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("engagements")
    .select("id");
  if (readError) return { ok: false, error: "failed" };

  // Once something is written, refresh the public site even if a later
  // step fails, so it never keeps serving the previous version.
  const failed = () => {
    updateTag(TAGS.engagements);
    return { ok: false, error: "failed" } as const;
  };

  const items = parsed.data.engagements.map((item) => ({
    ...item,
    id: item.id ?? crypto.randomUUID(),
  }));
  const kept = new Set(items.map((item) => item.id));
  const removed = existing.map((row) => row.id).filter((id) => !kept.has(id));

  if (items.length) {
    const { error } = await supabase.from("engagements").upsert(
      items.map((item, index) => ({
        id: item.id,
        organization: item.organization,
        since: item.since ? Number(item.since) : null,
        url: item.url || null,
        text_fr: item.text_fr,
        text_en: item.text_en,
        sort_order: index,
      })),
    );
    if (error) return failed();

    const { error: clearError } = await supabase
      .from("engagement_roles")
      .delete()
      .in("engagement_id", [...kept]);
    if (clearError) return failed();

    const roles = items.flatMap((item) =>
      item.roles.map((role, index) => ({
        engagement_id: item.id,
        ...role,
        sort_order: index,
      })),
    );
    if (roles.length) {
      const { error: rolesError } = await supabase
        .from("engagement_roles")
        .insert(roles);
      if (rolesError) return failed();
    }
  }

  // Roles of removed engagements go with them (on delete cascade).
  if (removed.length) {
    const { error } = await supabase
      .from("engagements")
      .delete()
      .in("id", removed);
    if (error) return failed();
  }

  updateTag(TAGS.engagements);
  return { ok: true, data: { engagements: items } };
}
