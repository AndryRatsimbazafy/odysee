"use client";

import { useTranslations } from "next-intl";
import { FormProvider, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { CheckField, SelectField, TextField } from "@/components/admin/fields";
import { ListFormFooter, OrderedList } from "@/components/admin/ordered-list";
import { useSaveForm } from "@/components/admin/use-save-form";
import { saveTechnologies } from "@/lib/actions/technologies";
import {
  technologiesSchema,
  WEAPONS,
  type TechnologiesValues,
} from "@/lib/validation/technologies";

const MISSING = [
  { name: "technologies", keys: ["duration_label", "role", "context"] },
];

export function TechnologiesForm({
  defaultValues,
}: {
  defaultValues: TechnologiesValues;
}) {
  const t = useTranslations("admin.technologies");
  const { form, status, pending, onSubmit } = useSaveForm(
    technologiesSchema,
    defaultValues,
    saveTechnologies,
  );
  const technologies = useWatch({
    control: form.control,
    name: "technologies",
  });
  const listError = form.formState.errors.technologies;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        <p className="text-sm text-muted-foreground">{t("removeHint")}</p>
        {(listError?.root || listError?.message) && (
          <p className="text-sm text-destructive">{t("duplicate")}</p>
        )}
        <OrderedList
          name="technologies"
          itemLabel={(i, n) => technologies[i]?.name || t("item", { n })}
          addLabel={t("add")}
          emptyLabel={t("empty")}
          newItem={() => ({
            name: "",
            category: "",
            years_of_use: "",
            duration_label_fr: "",
            duration_label_en: "",
            weapon: "",
            role_fr: "",
            role_en: "",
            context_fr: "",
            context_en: "",
            is_featured: false,
          })}
        >
          {(index) => {
            const base = `technologies.${index}`;
            return (
              <>
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_8rem]">
                  <TextField path={`${base}.name`} label={t("name")} />
                  <TextField path={`${base}.category`} label={t("category")} />
                  <TextField
                    path={`${base}.years_of_use`}
                    label={t("years")}
                    inputMode="decimal"
                    placeholder="4"
                  />
                </div>
                <BilingualField
                  fr={`${base}.duration_label_fr`}
                  en={`${base}.duration_label_en`}
                  label={t("durationLabel")}
                />
                <div className="grid items-end gap-3 md:grid-cols-2">
                  <SelectField
                    path={`${base}.weapon`}
                    label={t("weapon")}
                    options={[
                      { value: "", label: t("weaponNone") },
                      ...WEAPONS.map((value) => ({
                        value,
                        label: t(`weapons.${value}`),
                      })),
                    ]}
                  />
                  <div className="pb-2">
                    <CheckField
                      path={`${base}.is_featured`}
                      label={t("featured")}
                    />
                  </div>
                </div>
                <BilingualField
                  fr={`${base}.role_fr`}
                  en={`${base}.role_en`}
                  label={t("role")}
                  multiline
                  rows={2}
                />
                <BilingualField
                  fr={`${base}.context_fr`}
                  en={`${base}.context_en`}
                  label={t("context")}
                  multiline
                  rows={3}
                />
              </>
            );
          }}
        </OrderedList>
        <ListFormFooter
          lists={MISSING}
          status={status}
          pending={pending}
          dirty={form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}
