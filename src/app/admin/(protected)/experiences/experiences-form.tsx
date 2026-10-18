"use client";

import { useTranslations } from "next-intl";
import { Controller, FormProvider, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Checkbox } from "@/components/admin/checkbox";
import { CheckField, TextField } from "@/components/admin/fields";
import { ListFormFooter, OrderedList } from "@/components/admin/ordered-list";
import { useSaveForm } from "@/components/admin/use-save-form";
import { saveExperiences } from "@/lib/actions/experiences";
import type { TechnologyOption } from "@/lib/data/admin";
import {
  experiencesSchema,
  type ExperiencesValues,
} from "@/lib/validation/experiences";

const MISSING = [{ name: "experiences", keys: ["role", "message"] }];

export function ExperiencesForm({
  defaultValues,
  technologies,
}: {
  defaultValues: ExperiencesValues;
  technologies: TechnologyOption[];
}) {
  const t = useTranslations("admin.experiences");
  const { form, status, pending, onSubmit } = useSaveForm(
    experiencesSchema,
    defaultValues,
    saveExperiences,
  );
  const experiences = useWatch({ control: form.control, name: "experiences" });
  const errors = form.formState.errors.experiences;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        <OrderedList
          name="experiences"
          itemLabel={(i, n) => experiences[i]?.company || t("item", { n })}
          addLabel={t("add")}
          emptyLabel={t("empty")}
          newItem={() => ({
            company: "",
            role_fr: "",
            role_en: "",
            start_date: "",
            end_date: "",
            location: "",
            is_remote: false,
            message_fr: "",
            message_en: "",
            technology_ids: [],
          })}
        >
          {(index) => {
            const base = `experiences.${index}` as const;
            return (
              <>
                <div className="grid items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <TextField path={`${base}.company`} label={t("company")} />
                  <TextField path={`${base}.location`} label={t("location")} />
                  <div className="pb-2">
                    <CheckField
                      path={`${base}.is_remote`}
                      label={t("remote")}
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField
                    path={`${base}.start_date`}
                    label={t("startDate")}
                    type="date"
                  />
                  <TextField
                    path={`${base}.end_date`}
                    label={t("endDate")}
                    type="date"
                    hint={
                      errors?.[index]?.end_date
                        ? t("endBeforeStart")
                        : undefined
                    }
                  />
                </div>
                <BilingualField
                  fr={`${base}.role_fr`}
                  en={`${base}.role_en`}
                  label={t("role")}
                />
                <BilingualField
                  fr={`${base}.message_fr`}
                  en={`${base}.message_en`}
                  label={t("message")}
                  multiline
                  rows={3}
                />
                <Controller
                  control={form.control}
                  name={`${base}.technology_ids`}
                  render={({ field }) => (
                    <fieldset className="grid gap-2">
                      <legend className="mb-2 text-sm font-medium">
                        {t("technologies")}
                      </legend>
                      {technologies.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("noTechnologies")}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {technologies.map((tech) => (
                          <label
                            key={tech.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={field.value.includes(tech.id)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked === true
                                    ? [...field.value, tech.id]
                                    : field.value.filter(
                                        (id) => id !== tech.id,
                                      ),
                                )
                              }
                            />
                            {tech.name}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
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
