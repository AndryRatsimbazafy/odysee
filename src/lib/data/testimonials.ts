import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { pick } from "./localize";
import { TAGS } from "./tags";
import type { Testimonial } from "./types";

async function getTestimonialRows() {
  "use cache";
  cacheTag(TAGS.testimonials);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(`testimonials: ${error.message}`);
  return data;
}

/** Voices of Delphi: published only. An empty list hides the block. */
export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  const rows = await getTestimonialRows();
  return rows.map((row) => ({
    id: row.id,
    quote: pick(row, "quote", locale),
    author: row.author,
    role: pick(row, "role", locale),
    company: row.company,
    isAnonymized: row.is_anonymized,
  }));
}
