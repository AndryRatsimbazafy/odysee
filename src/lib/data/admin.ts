import "server-only";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { EngagementsValues } from "@/lib/validation/engagements";
import type { SocialLinksValues } from "@/lib/validation/links";
import type { ProfileValues } from "@/lib/validation/profile";
import { AVAILABILITY_MODES } from "@/lib/validation/profile";
import { bySortOrder } from "./localize";

// Admin reads: session client, no cache, raw FR/EN values (no fallback).
// Each one checks the admin itself, wherever it is called from.

export type ResumeInfo = { url: string | null; updatedAt: string | null };

export async function getProfileForm(): Promise<{
  values: ProfileValues;
  mediaBaseUrl: string;
}> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`profile: ${error.message}`);

  const row = data;
  const values: ProfileValues = {
    full_name: row?.full_name ?? "",
    title_fr: row?.title_fr ?? "",
    title_en: row?.title_en ?? "",
    tagline_fr: row?.tagline_fr ?? "",
    tagline_en: row?.tagline_en ?? "",
    recit_fr: row?.recit_fr ?? "",
    recit_en: row?.recit_en ?? "",
    bio_fr: row?.bio_fr ?? "",
    bio_en: row?.bio_en ?? "",
    hephaistos_fr: row?.hephaistos_fr ?? "",
    hephaistos_en: row?.hephaistos_en ?? "",
    athena_fr: row?.athena_fr ?? "",
    athena_en: row?.athena_en ?? "",
    location: row?.location ?? "",
    languages_fr: row?.languages_fr ?? "",
    languages_en: row?.languages_en ?? "",
    public_email: row?.public_email ?? "",
    is_available: row?.is_available ?? true,
    availability_modes: (row?.availability_modes ?? []).filter(
      (mode): mode is (typeof AVAILABILITY_MODES)[number] =>
        (AVAILABILITY_MODES as readonly string[]).includes(mode),
    ),
    availability_fr: row?.availability_fr ?? "",
    availability_en: row?.availability_en ?? "",
    available_from: row?.available_from ?? "",
    photo_path: row?.photo_path ?? null,
    photo_alt_fr: row?.photo_alt_fr ?? "",
    photo_alt_en: row?.photo_alt_en ?? "",
    seo_title_fr: row?.seo_title_fr ?? "",
    seo_title_en: row?.seo_title_en ?? "",
    seo_description_fr: row?.seo_description_fr ?? "",
    seo_description_en: row?.seo_description_en ?? "",
    og_image_path: row?.og_image_path ?? null,
  };

  // Public bucket: previews are built client-side from this prefix.
  const mediaBaseUrl = supabase.storage.from("media").getPublicUrl("")
    .data.publicUrl;
  return { values, mediaBaseUrl };
}

export async function getSocialLinksForm(): Promise<SocialLinksValues> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("id, platform, url")
    .order("sort_order");
  if (error) throw new Error(`social_links: ${error.message}`);
  return { links: data };
}

export async function getEngagementsForm(): Promise<EngagementsValues> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("engagements")
    .select("*, engagement_roles(label_fr, label_en, period, sort_order)")
    .order("sort_order");
  if (error) throw new Error(`engagements: ${error.message}`);

  return {
    engagements: data.map((row) => ({
      id: row.id,
      organization: row.organization,
      since: row.since ? String(row.since) : "",
      url: row.url ?? "",
      text_fr: row.text_fr,
      text_en: row.text_en,
      roles: [...row.engagement_roles]
        .sort(bySortOrder)
        .map(({ label_fr, label_en, period }) => ({
          label_fr,
          label_en,
          period,
        })),
    })),
  };
}

export async function getResumesInfo(): Promise<
  Record<"fr" | "en", ResumeInfo>
> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("locale, file_path, updated_at");
  if (error) throw new Error(`resumes: ${error.message}`);

  const info = (locale: "fr" | "en"): ResumeInfo => {
    const row = data.find((r) => r.locale === locale);
    if (!row?.file_path) return { url: null, updatedAt: null };
    return {
      url: supabase.storage.from("resumes").getPublicUrl(row.file_path).data
        .publicUrl,
      updatedAt: row.updated_at,
    };
  };
  return { fr: info("fr"), en: info("en") };
}
