"use client";

import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { CheckField } from "@/components/admin/fields";
import { ListFormFooter, OrderedList } from "@/components/admin/ordered-list";
import { useSaveForm } from "@/components/admin/use-save-form";
import { saveFaq } from "@/lib/actions/faq";
import { faqSchema, type FaqValues } from "@/lib/validation/faq";

const MISSING = [{ name: "questions", keys: ["question", "answer"] }];

export function FaqForm({ defaultValues }: { defaultValues: FaqValues }) {
  const t = useTranslations("admin.oracle");
  const { form, status, pending, onSubmit } = useSaveForm(
    faqSchema,
    defaultValues,
    saveFaq,
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        <OrderedList
          name="questions"
          itemLabel={(_, n) => t("item", { n })}
          addLabel={t("add")}
          emptyLabel={t("empty")}
          newItem={() => ({
            question_fr: "",
            question_en: "",
            answer_fr: "",
            answer_en: "",
            is_published: false,
          })}
        >
          {(index) => (
            <>
              <CheckField
                path={`questions.${index}.is_published`}
                label={t("published")}
              />
              <BilingualField
                fr={`questions.${index}.question_fr`}
                en={`questions.${index}.question_en`}
                label={t("question")}
              />
              <BilingualField
                fr={`questions.${index}.answer_fr`}
                en={`questions.${index}.answer_en`}
                label={t("answer")}
                multiline
                rows={4}
              />
            </>
          )}
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
