"use client";

import { useTranslations } from "next-intl";
import { FormProvider, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { CheckField, TextField } from "@/components/admin/fields";
import { ListFormFooter, OrderedList } from "@/components/admin/ordered-list";
import { useSaveForm } from "@/components/admin/use-save-form";
import { saveTestimonials } from "@/lib/actions/testimonials";
import {
  testimonialsSchema,
  type TestimonialsValues,
} from "@/lib/validation/testimonials";

const MISSING = [{ name: "testimonials", keys: ["quote", "role"] }];

export function TestimonialsForm({
  defaultValues,
}: {
  defaultValues: TestimonialsValues;
}) {
  const t = useTranslations("admin.testimonials");
  const { form, status, pending, onSubmit } = useSaveForm(
    testimonialsSchema,
    defaultValues,
    saveTestimonials,
  );
  const testimonials = useWatch({
    control: form.control,
    name: "testimonials",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        <OrderedList
          name="testimonials"
          itemLabel={(i, n) => testimonials[i]?.author || t("item", { n })}
          addLabel={t("add")}
          emptyLabel={t("empty")}
          newItem={() => ({
            quote_fr: "",
            quote_en: "",
            author: "",
            role_fr: "",
            role_en: "",
            company: "",
            is_anonymized: false,
            is_published: false,
          })}
        >
          {(index) => {
            const base = `testimonials.${index}`;
            return (
              <>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <CheckField
                    path={`${base}.is_published`}
                    label={t("published")}
                  />
                  <CheckField
                    path={`${base}.is_anonymized`}
                    label={t("anonymized")}
                  />
                </div>
                <BilingualField
                  fr={`${base}.quote_fr`}
                  en={`${base}.quote_en`}
                  label={t("quote")}
                  multiline
                  rows={4}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField path={`${base}.author`} label={t("author")} />
                  <TextField path={`${base}.company`} label={t("company")} />
                </div>
                <BilingualField
                  fr={`${base}.role_fr`}
                  en={`${base}.role_en`}
                  label={t("role")}
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
