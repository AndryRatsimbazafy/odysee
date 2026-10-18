"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { ImageField } from "@/components/admin/image-field";
import { ListControls } from "@/components/admin/list-controls";
import {
  MAX_PLATES,
  MIN_PLATES,
  PLATE_RATIOS,
  type ProjectValues,
} from "@/lib/validation/projects";
import { SelectField } from "./fields";

/** 4 to 5 plates per dossier (F-ADM-08b), each with its alt text (SEO-09). */
export function PlatesTab({
  projectId,
  mediaBaseUrl,
}: {
  projectId: string;
  mediaBaseUrl: string;
}) {
  const t = useTranslations("admin.projects.plates");
  const { control, formState } = useFormContext<ProjectValues>();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "plates",
    keyName: "key",
  });
  const layout = useWatch({ control, name: "layout" });

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <p className="text-sm text-muted-foreground">{t("hint")}</p>
        {fields.length < MIN_PLATES && (
          <p className="mono text-todo">
            {t("tooFew", { count: fields.length })}
          </p>
        )}
        {layout === "sealed" && (
          <p className="text-sm text-or-clair">{t("sealed")}</p>
        )}
      </div>
      <ol className="grid gap-10">
        {fields.map((field, index) => {
          const base = `plates.${index}` as const;
          const label = t("plate", { n: index + 1 });
          const altMissing = !!formState.errors.plates?.[index]?.alt_fr;
          return (
            <li
              key={field.key}
              className="grid gap-5 border-t border-border pt-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="kicker">{label}</h3>
                <ListControls
                  index={index}
                  count={fields.length}
                  onMove={move}
                  onRemove={remove}
                  itemLabel={label}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_12rem]">
                <ImageField
                  name={`${base}.path`}
                  label={t("image")}
                  baseUrl={mediaBaseUrl}
                  projectId={projectId}
                />
                <SelectField
                  path={`${base}.ratio`}
                  label={t("ratio")}
                  options={PLATE_RATIOS.map((value) => ({
                    value,
                    label: value,
                  }))}
                />
              </div>
              <BilingualField
                fr={`${base}.alt_fr`}
                en={`${base}.alt_en`}
                label={t("alt")}
              />
              {altMissing && (
                <p className="text-sm text-destructive">{t("altRequired")}</p>
              )}
              <BilingualField
                fr={`${base}.kind_fr`}
                en={`${base}.kind_en`}
                label={t("kind")}
              />
              <BilingualField
                fr={`${base}.caption_fr`}
                en={`${base}.caption_en`}
                label={t("caption")}
                multiline
                rows={2}
              />
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={fields.length >= MAX_PLATES}
          onClick={() =>
            append({
              path: null,
              kind_fr: "",
              kind_en: "",
              caption_fr: "",
              caption_en: "",
              alt_fr: "",
              alt_en: "",
              ratio: "16/10",
            })
          }
        >
          {t("add")}
        </Button>
        {fields.length >= MAX_PLATES && (
          <p className="text-sm text-muted-foreground">{t("max")}</p>
        )}
      </div>
    </div>
  );
}
