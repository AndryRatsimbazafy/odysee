"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import { createProject } from "@/lib/actions/projects";
import {
  newProjectSchema,
  slugify,
  type NewProjectValues,
} from "@/lib/validation/projects";

/** Title + slug, then the server creates the draft and opens its form. */
export function NewProjectForm() {
  const t = useTranslations("admin.projects");
  const tf = useTranslations("admin.form");
  const form = useForm<NewProjectValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { title_fr: "", title_en: "", slug: "" },
  });
  // The slug follows the French title until it is edited by hand.
  const [title, slug] = useWatch({
    control: form.control,
    name: ["title_fr", "slug"],
  });
  useEffect(() => {
    // setValue without shouldDirty: typing in the field is what marks it dirty.
    if (!form.getFieldState("slug").isDirty) {
      form.setValue("slug", slugify(title));
    }
  }, [title, form]);
  const [error, setError] = useState<"invalid" | "failed" | null>(null);
  const [pending, startTransition] = useTransition();
  const slugError = form.formState.errors.slug;

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        setError(null);
        const result = await createProject(values);
        if (result.ok) return;
        if (result.error === "slugTaken") {
          form.setError("slug", { type: "slugTaken" });
          setError("invalid");
        } else setError(result.error);
      }),
    () => setError("invalid"),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid max-w-3xl gap-6">
        <BilingualField fr="title_fr" en="title_en" label={t("fields.title")} />
        <div className="grid gap-1.5">
          <Label htmlFor="slug">{t("fields.slug")}</Label>
          <Input
            id="slug"
            aria-invalid={slugError ? true : undefined}
            aria-describedby="slug-hint"
            {...form.register("slug")}
          />
          <p id="slug-hint" className="text-sm text-muted-foreground">
            {slugError?.type === "slugTaken"
              ? t("fields.slugTaken")
              : t("fields.slugHint", { slug: slug || "…" })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? t("create.pending") : t("create.submit")}
          </Button>
          <p aria-live="polite" className="text-sm text-destructive">
            {error ? tf(error) : ""}
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
