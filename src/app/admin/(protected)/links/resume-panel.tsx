"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { Button } from "@/components/admin/button";
import { Label } from "@/components/admin/label";
import {
  commitResume,
  deleteResume,
  prepareResumeUpload,
} from "@/lib/actions/uploads";
import type { ResumeInfo } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/client";
import { MAX_UPLOAD_BYTES } from "@/lib/validation/uploads";

type State = "idle" | "uploading" | "saved" | "error";

/** Current CV of one locale: link, date, replace and remove. */
export function ResumePanel({
  locale,
  initial,
}: {
  locale: "fr" | "en";
  initial: ResumeInfo;
}) {
  const t = useTranslations("admin.resumes");
  const format = useFormatter();
  const id = useId();
  const [info, setInfo] = useState(initial);
  const [state, setState] = useState<State>("idle");
  const [pending, startTransition] = useTransition();

  async function upload(file: File) {
    if (file.type !== "application/pdf" || file.size > MAX_UPLOAD_BYTES) {
      return setState("error");
    }
    setState("uploading");
    const target = await prepareResumeUpload({
      locale,
      type: file.type,
      size: file.size,
    });
    if (!target.ok) return setState("error");
    const { error } = await createClient()
      .storage.from("resumes")
      .uploadToSignedUrl(target.path, target.token, file, {
        contentType: "application/pdf",
      });
    if (error) return setState("error");
    const result = await commitResume(locale, target.path);
    if (!result.ok) return setState("error");
    setInfo({ url: result.url, updatedAt: result.updatedAt });
    setState("saved");
  }

  const busy = state === "uploading" || pending;
  const message = {
    idle: "",
    uploading: t("uploading"),
    saved: t("saved"),
    error: t("error"),
  }[state];

  return (
    <div className="grid gap-3 border-t border-border pt-4">
      <h3 className="mono uppercase">{t(`locale.${locale}`)}</h3>
      {info.url ? (
        <p className="text-sm">
          <a
            href={info.url}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            {t("current")}
          </a>
          {info.updatedAt && (
            <span className="text-muted-foreground">
              {" · "}
              {t("updated", {
                date: format.dateTime(new Date(info.updatedAt), {
                  dateStyle: "medium",
                }),
              })}
            </span>
          )}
        </p>
      ) : (
        <p className="todo">{locale === "en" ? t("noneEn") : t("none")}</p>
      )}
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{info.url ? t("replace") : t("upload")}</Label>
        <input
          id={id}
          type="file"
          accept="application/pdf"
          disabled={busy}
          className="text-sm file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:text-foreground"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
        <p className="text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <p
        aria-live="polite"
        className={
          state === "error"
            ? "text-sm text-destructive"
            : "text-sm text-muted-foreground"
        }
      >
        {message}
      </p>
      {info.url && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-self-start"
          disabled={busy}
          onClick={() =>
            startTransition(async () => {
              if (!window.confirm(t("confirmRemove"))) return;
              const result = await deleteResume(locale);
              if (!result.ok) return setState("error");
              setInfo({ url: null, updatedAt: null });
              setState("idle");
            })
          }
        >
          {t("remove")}
        </Button>
      )}
    </div>
  );
}
