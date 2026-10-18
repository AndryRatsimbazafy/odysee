"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import type { SaveResult } from "@/lib/validation/shared";
import {
  testimonialsSchema,
  type TestimonialsValues,
} from "@/lib/validation/testimonials";
import { replaceList } from "./replace-list";

/** Saves the voices of Delphi in order; only published ones are shown. */
export async function saveTestimonials(
  input: TestimonialsValues,
): Promise<SaveResult<TestimonialsValues>> {
  await requireAdmin();
  const parsed = testimonialsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const list = parsed.data.testimonials;
  const ids = await replaceList(supabase, "testimonials", list);
  // Invalidate even on failure: replaceList may have written part of it.
  updateTag(TAGS.testimonials);
  if (!ids) return { ok: false, error: "failed" };
  return {
    ok: true,
    data: { testimonials: list.map((item, i) => ({ ...item, id: ids[i] })) },
  };
}
