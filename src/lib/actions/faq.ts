"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import { faqSchema, type FaqValues } from "@/lib/validation/faq";
import type { SaveResult } from "@/lib/validation/shared";
import { replaceList } from "./replace-list";

/** Saves the oracle's questions in order (F-ADM-16). */
export async function saveFaq(
  input: FaqValues,
): Promise<SaveResult<FaqValues>> {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const list = parsed.data.questions;
  const ids = await replaceList(supabase, "faq_items", list);
  // Invalidate even on failure: replaceList may have written part of it.
  updateTag(TAGS.faq);
  if (!ids) return { ok: false, error: "failed" };
  return {
    ok: true,
    data: { questions: list.map((item, i) => ({ ...item, id: ids[i] })) },
  };
}
