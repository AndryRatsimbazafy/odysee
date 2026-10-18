"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { TAGS } from "@/lib/data/tags";
import { createClient } from "@/lib/supabase/server";
import {
  IMAGE_TYPES,
  imageUploadSchema,
  resumePath,
  resumeUploadSchema,
} from "@/lib/validation/uploads";

// Files go straight from the browser to Storage through a signed upload URL:
// a Server Action body is capped (1 MB here, 4.5 MB on Vercel). The path is
// always generated here, never taken from the file name (ARCHITECTURE §4).

type UploadTarget =
  | { ok: true; path: string; token: string }
  | { ok: false; error: "invalid" | "failed" };

/**
 * Signed upload slot for an image in `media`: profile images by default,
 * `projects/{projectId}/` for a project's plates and share image.
 */
export async function prepareImageUpload(
  file: { type: string; size: number },
  projectId?: string,
): Promise<UploadTarget> {
  await requireAdmin();
  const parsed = imageUploadSchema.safeParse(file);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  let folder = "profile";
  if (projectId !== undefined) {
    if (!z.uuid().safeParse(projectId).success) {
      return { ok: false, error: "invalid" };
    }
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .maybeSingle();
    if (!project) return { ok: false, error: "invalid" };
    folder = `projects/${projectId}`;
  }

  const path = `${folder}/${crypto.randomUUID()}.${IMAGE_TYPES[parsed.data.type]}`;
  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUploadUrl(path);
  if (error) return { ok: false, error: "failed" };
  return { ok: true, path, token: data.token };
}

/** Signed upload slot for a CV PDF in `resumes`. */
export async function prepareResumeUpload(file: {
  locale: string;
  type: string;
  size: number;
}): Promise<UploadTarget> {
  await requireAdmin();
  const parsed = resumeUploadSchema.safeParse(file);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const path = `${parsed.data.locale}/${crypto.randomUUID()}.pdf`;
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUploadUrl(path);
  if (error) return { ok: false, error: "failed" };
  return { ok: true, path, token: data.token };
}

type ResumeResult =
  | { ok: true; url: string | null; updatedAt: string | null }
  | { ok: false; error: "invalid" | "failed" };

/** Records an uploaded CV as the current one for its locale. */
export async function commitResume(
  locale: "fr" | "en",
  path: string,
): Promise<ResumeResult> {
  await requireAdmin();
  if (!resumePath.safeParse(path).success || !path.startsWith(`${locale}/`)) {
    return { ok: false, error: "invalid" };
  }

  const supabase = await createClient();
  const { data: previous } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("locale", locale)
    .maybeSingle();

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("resumes")
    .upsert({ locale, file_path: path, updated_at: updatedAt });
  if (error) return { ok: false, error: "failed" };

  if (previous?.file_path && previous.file_path !== path) {
    await supabase.storage.from("resumes").remove([previous.file_path]);
  }

  updateTag(TAGS.resumes);
  const url = supabase.storage.from("resumes").getPublicUrl(path)
    .data.publicUrl;
  return { ok: true, url, updatedAt };
}

/** Removes the CV of a locale (the site then falls back to the French one). */
export async function deleteResume(locale: "fr" | "en"): Promise<ResumeResult> {
  await requireAdmin();
  if (locale !== "fr" && locale !== "en")
    return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { data: previous } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("locale", locale)
    .maybeSingle();

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("locale", locale);
  if (error) return { ok: false, error: "failed" };
  if (previous?.file_path) {
    await supabase.storage.from("resumes").remove([previous.file_path]);
  }

  updateTag(TAGS.resumes);
  return { ok: true, url: null, updatedAt: null };
}
