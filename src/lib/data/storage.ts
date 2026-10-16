import type { createPublicClient } from "@/lib/supabase/server";

type Client = ReturnType<typeof createPublicClient>;

/** Public URL of a file in the `media` bucket (no network call). */
export function mediaUrl(client: Client, path: string | null): string | null {
  if (!path) return null;
  return client.storage.from("media").getPublicUrl(path).data.publicUrl;
}
