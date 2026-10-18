import { z } from "zod";

/** Optional text column (NOT NULL DEFAULT ''): trimmed, capped. */
export const text = (max = 2000) => z.string().trim().max(max);

/** Optional URL: empty string or http(s) URL. */
export const optionalUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/ }),
]);

/** Image stored by the upload action: `{folder}/{uuid}.{ext}` in `media`. */
export const mediaPath = (folder: string) =>
  z
    .string()
    .regex(new RegExp(`^${folder}/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`))
    .nullable();

export type SaveResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: "invalid" | "failed" };
