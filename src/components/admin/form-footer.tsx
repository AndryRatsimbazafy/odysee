"use client";

import { useTranslations } from "next-intl";
import { Button } from "./button";

export type FormStatus = "idle" | "saved" | "invalid" | "failed";

type FormFooterProps = {
  status: FormStatus;
  pending: boolean;
  dirty: boolean;
  /** Pairs with one language left empty (shown, never blocking). */
  missing?: number;
};

/** Sticky save bar: status message (aria-live) + save button. */
export function FormFooter({
  status,
  pending,
  dirty,
  missing = 0,
}: FormFooterProps) {
  const t = useTranslations("admin.form");
  const message =
    status === "saved" && !dirty
      ? t("saved")
      : status === "invalid"
        ? t("invalid")
        : status === "failed"
          ? t("failed")
          : dirty
            ? t("unsaved")
            : "";

  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border-t border-border bg-background py-4">
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <p
          aria-live="polite"
          className={
            status === "invalid" || status === "failed"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
        {missing > 0 && (
          <p className="mono text-todo">
            {t("missingCount", { count: missing })}
          </p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </div>
  );
}
