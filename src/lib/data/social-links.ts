import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { TAGS } from "./tags";
import type { SocialLink } from "./types";

/** Social links (LinkedIn, GitHub…), in admin order. */
export async function getSocialLinks(): Promise<SocialLink[]> {
  "use cache";
  cacheTag(TAGS.socialLinks);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("social_links")
    .select("id, platform, url")
    .order("sort_order");
  if (error) throw new Error(`social_links: ${error.message}`);
  return data;
}
