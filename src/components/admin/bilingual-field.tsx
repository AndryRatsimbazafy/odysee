"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

type BilingualFieldProps = {
  /** Field paths, e.g. "title_fr" / "title_en" or "engagements.0.text_fr". */
  fr: string;
  en: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
};

const isMissing = (value: unknown, other: unknown) =>
  !String(value ?? "").trim() && !!String(other ?? "").trim();

/** FR and EN side by side; flags the side left empty when the other is filled. */
export function BilingualField({
  fr,
  en,
  label,
  multiline = false,
  rows = 4,
  maxLength,
}: BilingualFieldProps) {
  const t = useTranslations("admin.form");
  const { register, control, formState } = useFormContext();
  const [frValue, enValue] = useWatch({ control, name: [fr, en] });

  const sides = [
    { lang: "fr", path: fr, missing: isMissing(frValue, enValue) },
    { lang: "en", path: en, missing: isMissing(enValue, frValue) },
  ] as const;
  const Control = multiline ? Textarea : Input;

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {sides.map(({ lang, path, missing }) => {
          const id = path.replaceAll(".", "-");
          const invalid = !!getError(formState.errors, path);
          return (
            <div key={lang} className="grid gap-1.5">
              <div className="flex h-5 items-center justify-between gap-2">
                <Label htmlFor={id} className="mono uppercase">
                  {lang}
                </Label>
                {missing && (
                  <span className="mono text-todo" id={`${id}-missing`}>
                    {t("missing", { lang: lang.toUpperCase() })}
                  </span>
                )}
              </div>
              <Control
                id={id}
                rows={multiline ? rows : undefined}
                maxLength={maxLength}
                lang={lang}
                aria-invalid={invalid || undefined}
                aria-describedby={missing ? `${id}-missing` : undefined}
                {...register(path)}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Number of bilingual pairs with exactly one side filled. */
export function useMissingTranslations(pairs: readonly [string, string][]) {
  const { control } = useFormContext();
  const values = useWatch({ control, name: pairs.flat() });
  let count = 0;
  for (let i = 0; i < values.length; i += 2) {
    const [fr, en] = [values[i], values[i + 1]];
    if (isMissing(fr, en) || isMissing(en, fr)) count++;
  }
  return count;
}

function getError(errors: object, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      errors,
    );
}
