import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { TAGS } from "./tags";

async function getResumeRows() {
  "use cache";
  cacheTag(TAGS.resumes);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("resumes")
    .select("locale, file_path");
  if (error) throw new Error(`resumes: ${error.message}`);
  return data;
}

/** Public URL of the CV PDF for this locale (French one as fallback), or null. */
export async function getResumeUrl(locale: Locale): Promise<string | null> {
  const rows = await getResumeRows();
  const row =
    rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === "fr");
  if (!row?.file_path) return null;

  return createPublicClient().storage.from("resumes").getPublicUrl(row.file_path)
    .data.publicUrl;
}
