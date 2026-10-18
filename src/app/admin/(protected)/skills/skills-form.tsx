"use client";

import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { FormSection } from "@/components/admin/form-section";
import { ListFormFooter, OrderedList } from "@/components/admin/ordered-list";
import { useSaveForm } from "@/components/admin/use-save-form";
import { saveSkills } from "@/lib/actions/skills";
import {
  SKILL_DOMAINS,
  skillsSchema,
  type SkillsValues,
} from "@/lib/validation/skills";

const MISSING = SKILL_DOMAINS.map((name) => ({
  name,
  keys: ["label", "description"],
}));

export function SkillsForm({ defaultValues }: { defaultValues: SkillsValues }) {
  const t = useTranslations("admin.skills");
  const { form, status, pending, onSubmit } = useSaveForm(
    skillsSchema,
    defaultValues,
    saveSkills,
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-12">
        {SKILL_DOMAINS.map((domain) => (
          <FormSection key={domain} title={t(domain)}>
            <OrderedList
              name={domain}
              itemLabel={(_, n) => t("item", { n })}
              addLabel={t("add")}
              emptyLabel={t("empty")}
              newItem={() => ({
                label_fr: "",
                label_en: "",
                description_fr: "",
                description_en: "",
              })}
            >
              {(index) => (
                <>
                  <BilingualField
                    fr={`${domain}.${index}.label_fr`}
                    en={`${domain}.${index}.label_en`}
                    label={t("label")}
                  />
                  <BilingualField
                    fr={`${domain}.${index}.description_fr`}
                    en={`${domain}.${index}.description_en`}
                    label={t("description")}
                    multiline
                    rows={2}
                  />
                </>
              )}
            </OrderedList>
          </FormSection>
        ))}
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
