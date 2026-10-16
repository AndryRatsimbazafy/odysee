import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { pick } from "./localize";
import { TAGS } from "./tags";
import type { FaqItem } from "./types";

async function getFaqRows() {
  "use cache";
  cacheTag(TAGS.faq);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("faq_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(`faq: ${error.message}`);
  return data;
}

/** Published questions of the oracle. */
export async function getFaq(locale: Locale): Promise<FaqItem[]> {
  const rows = await getFaqRows();
  return rows.map((row) => ({
    id: row.id,
    question: pick(row, "question", locale),
    answer: pick(row, "answer", locale),
  }));
}
