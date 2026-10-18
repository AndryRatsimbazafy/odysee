"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { prepareImageUpload } from "@/lib/actions/uploads";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validation/uploads";
import { Button } from "./button";
import { Label } from "./label";

type ImageFieldProps = {
  name: string;
  label: string;
  /** Public URL prefix of the `media` bucket. */
  baseUrl: string;
};

/**
 * Uploads an image to `media` and stores its path in the form field.
 * The previous file is removed when the form is saved.
 */
export function ImageField({ name, label, baseUrl }: ImageFieldProps) {
  const t = useTranslations("admin.upload");
  const id = useId();
  const { control, setValue } = useFormContext();
  const path = useWatch({ control, name }) as string | null;
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!(file.type in IMAGE_TYPES) || file.size > MAX_UPLOAD_BYTES) {
      setState("error");
      return;
    }
    setState("uploading");
    const target = await prepareImageUpload({
      type: file.type,
      size: file.size,
    });
    if (!target.ok) return setState("error");
    const { error } = await createClient()
      .storage.from("media")
      .uploadToSignedUrl(target.path, target.token, file, {
        contentType: file.type,
      });
    if (error) return setState("error");
    setValue(name, target.path, { shouldDirty: true });
    setState("idle");
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-28 place-items-center overflow-hidden border border-border bg-nuit-3">
          {path ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a storage URL
            <img
              src={baseUrl + path}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="todo">{t("none")}</span>
          )}
        </div>
        <div className="grid gap-2">
          <input
            id={id}
            type="file"
            accept={Object.keys(IMAGE_TYPES).join(",")}
            className="text-sm file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:text-foreground"
            disabled={state === "uploading"}
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {state === "uploading"
              ? t("uploading")
              : state === "error"
                ? t("imageError")
                : t("imageHint")}
          </p>
          {path && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-self-start"
              onClick={() => setValue(name, null, { shouldDirty: true })}
            >
              {t("remove")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
