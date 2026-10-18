"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { FormSection } from "@/components/admin/form-section";
import { ListControls } from "@/components/admin/list-controls";
import type { ProjectValues } from "@/lib/validation/projects";

export function WorkTab() {
  const t = useTranslations("admin.projects.work");
  return (
    <div className="grid gap-10">
      <ItemList
        name="contributions"
        title={t("contributions")}
        itemLabel={(n) => t("contribution", { n })}
        addLabel={t("addContribution")}
      />
      <ItemList
        name="results"
        title={t("results")}
        itemLabel={(n) => t("result", { n })}
        addLabel={t("addResult")}
      />
      <DecisionList />
    </div>
  );
}

/** Ordered list of short bilingual texts (contributions, results). */
function ItemList({
  name,
  title,
  itemLabel,
  addLabel,
}: {
  name: "contributions" | "results";
  title: string;
  itemLabel: (n: number) => string;
  addLabel: string;
}) {
  const t = useTranslations("admin.projects.work");
  const { control } = useFormContext<ProjectValues>();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name,
    keyName: "key",
  });

  return (
    <FormSection title={title}>
      {fields.length === 0 && <p className="todo">{t("none")}</p>}
      <ol className="grid gap-6">
        {fields.map((field, index) => (
          <li
            key={field.key}
            className="grid gap-3 border-l border-border pl-4"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="mono">{itemLabel(index + 1)}</span>
              <ListControls
                index={index}
                count={fields.length}
                onMove={move}
                onRemove={remove}
                itemLabel={itemLabel(index + 1)}
              />
            </div>
            <BilingualField
              fr={`${name}.${index}.text_fr`}
              en={`${name}.${index}.text_en`}
              label={t("text")}
              multiline
              rows={2}
            />
          </li>
        ))}
      </ol>
      <Button
        type="button"
        variant="outline"
        className="justify-self-start"
        onClick={() => append({ text_fr: "", text_en: "" })}
      >
        {addLabel}
      </Button>
    </FormSection>
  );
}

/** Technical decisions: title · why · trade-off. */
function DecisionList() {
  const t = useTranslations("admin.projects.work");
  const { control } = useFormContext<ProjectValues>();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "decisions",
    keyName: "key",
  });

  return (
    <FormSection title={t("decisions")}>
      {fields.length === 0 && <p className="todo">{t("none")}</p>}
      <ol className="grid gap-8">
        {fields.map((field, index) => {
          const base = `decisions.${index}` as const;
          const label = t("decision", { n: index + 1 });
          return (
            <li
              key={field.key}
              className="grid gap-4 border-l border-border pl-4"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="mono">{label}</span>
                <ListControls
                  index={index}
                  count={fields.length}
                  onMove={move}
                  onRemove={remove}
                  itemLabel={label}
                />
              </div>
              <BilingualField
                fr={`${base}.title_fr`}
                en={`${base}.title_en`}
                label={t("decisionTitle")}
              />
              <BilingualField
                fr={`${base}.why_fr`}
                en={`${base}.why_en`}
                label={t("why")}
                multiline
                rows={3}
              />
              <BilingualField
                fr={`${base}.tradeoff_fr`}
                en={`${base}.tradeoff_en`}
                label={t("tradeoff")}
                multiline
                rows={3}
              />
            </li>
          );
        })}
      </ol>
      <Button
        type="button"
        variant="outline"
        className="justify-self-start"
        onClick={() =>
          append({
            title_fr: "",
            title_en: "",
            why_fr: "",
            why_en: "",
            tradeoff_fr: "",
            tradeoff_en: "",
          })
        }
      >
        {t("addDecision")}
      </Button>
    </FormSection>
  );
}
