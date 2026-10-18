"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { ListControls } from "@/components/admin/list-controls";
import type { TechnologyOption } from "@/lib/data/admin";
import type { ProjectValues } from "@/lib/validation/projects";
import { SelectField } from "./fields";

/** Technologies of the project and their usage (feeds the arsenal). */
export function StackTab({ options }: { options: TechnologyOption[] }) {
  const t = useTranslations("admin.projects.stack");
  const { control, formState } = useFormContext<ProjectValues>();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "technologies",
    keyName: "key",
  });
  const chosen = useWatch({ control, name: "technologies" }).map(
    (tech) => tech.technology_id,
  );
  const nextOption = options.find((option) => !chosen.includes(option.id));
  const nameOf = (id: string) => options.find((o) => o.id === id)?.name;

  if (!options.length) return <p className="todo">{t("noOptions")}</p>;

  return (
    <div className="grid gap-8">
      <p className="text-sm text-muted-foreground">{t("hint")}</p>
      {fields.length === 0 && <p className="todo">{t("none")}</p>}
      {(formState.errors.technologies?.root ||
        formState.errors.technologies?.message) && (
        <p className="text-sm text-destructive">{t("duplicate")}</p>
      )}
      <ol className="grid gap-6">
        {fields.map((field, index) => {
          const base = `technologies.${index}` as const;
          const label =
            nameOf(chosen[index] ?? "") ?? t("item", { n: index + 1 });
          return (
            <li
              key={field.key}
              className="grid gap-3 border-l border-border pl-4"
            >
              <div className="flex items-end justify-between gap-4">
                <div className="w-64 max-w-full">
                  <SelectField
                    path={`${base}.technology_id`}
                    label={t("technology")}
                    options={options.map((option) => ({
                      value: option.id,
                      label: option.name,
                      disabled:
                        option.id !== chosen[index] &&
                        chosen.includes(option.id),
                    }))}
                  />
                </div>
                <ListControls
                  index={index}
                  count={fields.length}
                  onMove={move}
                  onRemove={remove}
                  itemLabel={label}
                />
              </div>
              <BilingualField
                fr={`${base}.usage_fr`}
                en={`${base}.usage_en`}
                label={t("usage")}
              />
            </li>
          );
        })}
      </ol>
      <Button
        type="button"
        variant="outline"
        className="justify-self-start"
        disabled={!nextOption}
        onClick={() =>
          nextOption &&
          append({ technology_id: nextOption.id, usage_fr: "", usage_en: "" })
        }
      >
        {t("add")}
      </Button>
    </div>
  );
}
