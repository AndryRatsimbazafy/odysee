"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  BilingualField,
  useMissingTranslations,
} from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { FormFooter, type FormStatus } from "@/components/admin/form-footer";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import { ListControls } from "@/components/admin/list-controls";
import { saveEngagements } from "@/lib/actions/engagements";
import {
  engagementsSchema,
  type EngagementsValues,
} from "@/lib/validation/engagements";

export function EngagementForm({
  defaultValues,
}: {
  defaultValues: EngagementsValues;
}) {
  const t = useTranslations("admin.engagement");
  const form = useForm<EngagementsValues>({
    resolver: zodResolver(engagementsSchema),
    defaultValues,
  });
  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: "engagements",
    keyName: "key",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveEngagements(values);
        if (result.ok) form.reset(result.data);
        setStatus(result.ok ? "saved" : result.error);
      }),
    () => setStatus("invalid"),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        {fields.length === 0 && <p className="todo">{t("empty")}</p>}
        {fields.map((field, index) => (
          <article
            key={field.key}
            className="grid gap-6 border-t border-border pt-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="kicker">{t("item", { n: index + 1 })}</h2>
              <ListControls
                index={index}
                count={fields.length}
                onMove={move}
                onRemove={remove}
                itemLabel={
                  form.getValues(`engagements.${index}.organization`) ||
                  t("item", { n: index + 1 })
                }
              />
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_8rem_1fr]">
              <Field
                path={`engagements.${index}.organization`}
                label={t("organization")}
              />
              <Field
                path={`engagements.${index}.since`}
                label={t("since")}
                inputMode="numeric"
                placeholder="2019"
              />
              <Field
                path={`engagements.${index}.url`}
                label={t("url")}
                type="url"
                placeholder="https://"
              />
            </div>
            <BilingualField
              fr={`engagements.${index}.text_fr`}
              en={`engagements.${index}.text_en`}
              label={t("text")}
              multiline
              rows={3}
            />
            <Roles index={index} />
          </article>
        ))}
        <Button
          type="button"
          variant="outline"
          className="justify-self-start"
          onClick={() =>
            append({
              organization: "",
              since: "",
              url: "",
              text_fr: "",
              text_en: "",
              roles: [],
            })
          }
        >
          {t("add")}
        </Button>
        <EngagementFooter
          status={status}
          pending={pending}
          dirty={form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}

function Roles({ index }: { index: number }) {
  const t = useTranslations("admin.engagement");
  const { control } = useFormContext<EngagementsValues>();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: `engagements.${index}.roles`,
    keyName: "key",
  });

  return (
    <fieldset className="grid gap-4">
      <legend className="mb-2 text-sm font-medium">{t("roles")}</legend>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("noRoles")}</p>
      )}
      {fields.map((field, roleIndex) => {
        const base = `engagements.${index}.roles.${roleIndex}` as const;
        return (
          <div
            key={field.key}
            className="grid gap-3 border-l border-border pl-4"
          >
            <div className="flex items-end justify-between gap-4">
              <div className="w-40">
                <Field
                  path={`${base}.period`}
                  label={t("period")}
                  placeholder="2023–2024"
                />
              </div>
              <ListControls
                index={roleIndex}
                count={fields.length}
                onMove={move}
                onRemove={remove}
                itemLabel={t("role", { n: roleIndex + 1 })}
              />
            </div>
            <BilingualField
              fr={`${base}.label_fr`}
              en={`${base}.label_en`}
              label={t("roleLabel")}
            />
          </div>
        );
      })}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="justify-self-start"
        onClick={() => append({ label_fr: "", label_en: "", period: "" })}
      >
        {t("addRole")}
      </Button>
    </fieldset>
  );
}

function Field({
  path,
  label,
  ...props
}: { path: string; label: string } & React.ComponentProps<typeof Input>) {
  const { register, getFieldState, formState } = useFormContext();
  const id = path.replaceAll(".", "-");
  const { invalid } = getFieldState(path, formState);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={invalid || undefined}
        {...props}
        {...register(path)}
      />
    </div>
  );
}

function EngagementFooter(props: {
  status: FormStatus;
  pending: boolean;
  dirty: boolean;
}) {
  const { control } = useFormContext<EngagementsValues>();
  const engagements = useWatch({ control, name: "engagements" });
  const pairs = useMemo(
    () =>
      engagements.flatMap((item, i) => [
        [`engagements.${i}.text_fr`, `engagements.${i}.text_en`] as [
          string,
          string,
        ],
        ...item.roles.map(
          (_, r) =>
            [
              `engagements.${i}.roles.${r}.label_fr`,
              `engagements.${i}.roles.${r}.label_en`,
            ] as [string, string],
        ),
      ]),
    [engagements],
  );
  const missing = useMissingTranslations(pairs);
  return <FormFooter {...props} missing={missing} />;
}
