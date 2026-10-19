import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { pick } from "./localize";
import { mediaUrl } from "./storage";
import { TAGS } from "./tags";
import type { AvailabilityMode, Profile } from "./types";

async function getProfileRow() {
  "use cache";
  cacheTag(TAGS.profile);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("profile")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`profile: ${error.message}`);
  return data;
}

/** The single profile row, or null if it has not been created yet. */
export async function getProfile(locale: Locale): Promise<Profile | null> {
  const row = await getProfileRow();
  if (!row) return null;

  const client = createPublicClient();
  const photo = mediaUrl(client, row.photo_path);

  return {
    fullName: row.full_name,
    title: pick(row, "title", locale),
    tagline: pick(row, "tagline", locale),
    recit: pick(row, "recit", locale),
    bio: pick(row, "bio", locale),
    hephaistos: pick(row, "hephaistos", locale),
    athena: pick(row, "athena", locale),
    location: row.location,
    languages: pick(row, "languages", locale),
    isAvailable: row.is_available,
    availabilityModes: row.availability_modes as AvailabilityMode[],
    availability: pick(row, "availability", locale),
    availableFrom: row.available_from,
    publicEmail: row.public_email,
    photo: photo ? { src: photo, alt: pick(row, "photo_alt", locale) } : null,
    seo: {
      title: pick(row, "seo_title", locale),
      description: pick(row, "seo_description", locale),
      ogImage: mediaUrl(client, row.og_image_path),
    },
    updatedAt: row.updated_at,
  };
}
