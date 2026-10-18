"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/admin/button";
import { FormFooter, type FormStatus } from "@/components/admin/form-footer";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import { ListControls } from "@/components/admin/list-controls";
import { saveSocialLinks } from "@/lib/actions/links";
import {
  socialLinksSchema,
  type SocialLinksValues,
} from "@/lib/validation/links";

export function LinksForm({
  defaultValues,
}: {
  defaultValues: SocialLinksValues;
}) {
  const t = useTranslations("admin.links");
  const form = useForm<SocialLinksValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues,
  });
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: "links",
    keyName: "key",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pending, startTransition] = useTransition();
  const errors = form.formState.errors.links;

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveSocialLinks(values);
        if (result.ok) form.reset(result.data);
        setStatus(result.ok ? "saved" : result.error);
      }),
    () => setStatus("invalid"),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-6">
        {fields.length === 0 && <p className="todo">{t("empty")}</p>}
        <ol className="grid gap-4">
          {fields.map((field, index) => (
            <li
              key={field.key}
              className="grid items-end gap-3 border-b border-border pb-4 md:grid-cols-[12rem_1fr_auto]"
            >
              <div className="grid gap-1.5">
                <Label htmlFor={`links-${index}-platform`}>
                  {t("platform")}
                </Label>
                <Input
                  id={`links-${index}-platform`}
                  aria-invalid={errors?.[index]?.platform ? true : undefined}
                  {...form.register(`links.${index}.platform`)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`links-${index}-url`}>{t("url")}</Label>
                <Input
                  id={`links-${index}-url`}
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  aria-invalid={errors?.[index]?.url ? true : undefined}
                  {...form.register(`links.${index}.url`)}
                />
              </div>
              <ListControls
                index={index}
                count={fields.length}
                onMove={move}
                onRemove={remove}
                itemLabel={
                  form.getValues(`links.${index}.platform`) || t("item")
                }
              />
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="outline"
          className="justify-self-start"
          onClick={() => append({ platform: "", url: "" })}
        >
          {t("add")}
        </Button>
        <FormFooter
          status={status}
          pending={pending}
          dirty={form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}
