import { z } from "zod";
import { mediaPath, text } from "./shared";

export const AVAILABILITY_MODES = ["cdi", "freelance", "remote"] as const;

/** Bilingual columns of `profile`, edited side by side (FR | EN). */
export const PROFILE_BILINGUAL = [
  "title",
  "tagline",
  "recit",
  "bio",
  "hephaistos",
  "athena",
  "languages",
  "availability",
  "photo_alt",
  "seo_title",
  "seo_description",
] as const;

export const profileSchema = z.object({
  full_name: text(120),
  title_fr: text(160),
  title_en: text(160),
  tagline_fr: text(300),
  tagline_en: text(300),
  recit_fr: text(4000),
  recit_en: text(4000),
  bio_fr: text(4000),
  bio_en: text(4000),
  hephaistos_fr: text(2000),
  hephaistos_en: text(2000),
  athena_fr: text(2000),
  athena_en: text(2000),
  location: text(120),
  languages_fr: text(200),
  languages_en: text(200),
  public_email: z.union([z.literal(""), z.email()]),
  is_available: z.boolean(),
  availability_modes: z.array(z.enum(AVAILABILITY_MODES)),
  availability_fr: text(300),
  availability_en: text(300),
  // <input type="date"> value, or empty.
  available_from: z.union([z.literal(""), z.iso.date()]),
  photo_path: mediaPath("profile"),
  photo_alt_fr: text(200),
  photo_alt_en: text(200),
  seo_title_fr: text(70),
  seo_title_en: text(70),
  seo_description_fr: text(170),
  seo_description_en: text(170),
  og_image_path: mediaPath("profile"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
