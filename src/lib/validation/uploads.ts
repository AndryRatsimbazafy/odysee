import { z } from "zod";

// Same limits as the storage buckets (storage_buckets migration).
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export const imageUploadSchema = z.object({
  type: z.enum(Object.keys(IMAGE_TYPES) as [keyof typeof IMAGE_TYPES]),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const resumeUploadSchema = z.object({
  locale: z.enum(["fr", "en"]),
  type: z.literal("application/pdf"),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const resumePath = z.string().regex(/^(fr|en)\/[0-9a-f-]{36}\.pdf$/);
