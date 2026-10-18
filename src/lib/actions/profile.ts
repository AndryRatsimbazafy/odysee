"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileValues } from "@/lib/validation/profile";
import type { SaveResult } from "@/lib/validation/shared";

/** Saves the single profile row (identity, story, availability, photo, SEO). */
export async function saveProfile(input: ProfileValues): Promise<SaveResult> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const values = parsed.data;

  const supabase = await createClient();
  const { data: previous } = await supabase
    .from("profile")
    .select("photo_path, og_image_path")
    .maybeSingle();

  const { error } = await supabase.from("profile").upsert({
    id: true,
    ...values,
    available_from: values.available_from || null,
  });
  if (error) return { ok: false, error: "failed" };

  // Drop images that were replaced or removed (best effort).
  const stale = [previous?.photo_path, previous?.og_image_path].filter(
    (path): path is string =>
      !!path && path !== values.photo_path && path !== values.og_image_path,
  );
  if (stale.length) await supabase.storage.from("media").remove(stale);

  updateTag(TAGS.profile);
  return { ok: true, data: undefined };
}
