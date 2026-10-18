"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  BilingualField,
  useMissingTranslations,
} from "@/components/admin/bilingual-field";
import { Checkbox } from "@/components/admin/checkbox";
import { FormFooter, type FormStatus } from "@/components/admin/form-footer";
import { FormSection } from "@/components/admin/form-section";
import { ImageField } from "@/components/admin/image-field";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import { saveProfile } from "@/lib/actions/profile";
import {
  AVAILABILITY_MODES,
  PROFILE_BILINGUAL,
  profileSchema,
  type ProfileValues,
} from "@/lib/validation/profile";

const PAIRS = PROFILE_BILINGUAL.map(
  (key) => [`${key}_fr`, `${key}_en`] as [string, string],
);

export function ProfileForm({
  defaultValues,
  mediaBaseUrl,
}: {
  defaultValues: ProfileValues;
  mediaBaseUrl: string;
}) {
  const t = useTranslations("admin.profile");
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveProfile(values);
        if (result.ok) form.reset(values);
        setStatus(result.ok ? "saved" : result.error);
      }),
    () => setStatus("invalid"),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-10">
        <FormSection title={t("identity")}>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField name="full_name" label={t("fullName")} />
            <TextField name="location" label={t("location")} />
            <TextField
              name="public_email"
              label={t("publicEmail")}
              type="email"
            />
          </div>
          <BilingualField fr="title_fr" en="title_en" label={t("title")} />
          <BilingualField
            fr="tagline_fr"
            en="tagline_en"
            label={t("tagline")}
            multiline
            rows={2}
          />
          <BilingualField
            fr="languages_fr"
            en="languages_en"
            label={t("languages")}
          />
        </FormSection>

        <FormSection title={t("story")}>
          <BilingualField
            fr="recit_fr"
            en="recit_en"
            label={t("recit")}
            multiline
            rows={6}
          />
          <BilingualField
            fr="bio_fr"
            en="bio_en"
            label={t("bio")}
            multiline
            rows={6}
          />
          <BilingualField
            fr="hephaistos_fr"
            en="hephaistos_en"
            label={t("hephaistos")}
            multiline
          />
          <BilingualField
            fr="athena_fr"
            en="athena_en"
            label={t("athena")}
            multiline
          />
        </FormSection>

        <FormSection title={t("availability")}>
          <Controller
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                {t("isAvailable")}
              </label>
            )}
          />
          <Controller
            control={form.control}
            name="availability_modes"
            render={({ field }) => (
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium">
                  {t("modes")}
                </legend>
                <div className="flex flex-wrap gap-6">
                  {AVAILABILITY_MODES.map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Checkbox
                        checked={field.value.includes(mode)}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked === true
                              ? [...field.value, mode]
                              : field.value.filter((m) => m !== mode),
                          )
                        }
                      />
                      {t(`mode.${mode}`)}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              name="available_from"
              label={t("availableFrom")}
              type="date"
            />
          </div>
          <BilingualField
            fr="availability_fr"
            en="availability_en"
            label={t("availabilityText")}
          />
        </FormSection>

        <FormSection title={t("photo")}>
          <ImageField
            name="photo_path"
            label={t("photoFile")}
            baseUrl={mediaBaseUrl}
          />
          <BilingualField
            fr="photo_alt_fr"
            en="photo_alt_en"
            label={t("photoAlt")}
          />
        </FormSection>

        <FormSection title={t("seo")}>
          <BilingualField
            fr="seo_title_fr"
            en="seo_title_en"
            label={t("seoTitle")}
            maxLength={70}
          />
          <BilingualField
            fr="seo_description_fr"
            en="seo_description_en"
            label={t("seoDescription")}
            multiline
            rows={3}
            maxLength={170}
          />
          <ImageField
            name="og_image_path"
            label={t("ogImage")}
            baseUrl={mediaBaseUrl}
          />
          <p className="text-sm text-muted-foreground">{t("ogImageHint")}</p>
        </FormSection>

        <ProfileFooter
          status={status}
          pending={pending}
          dirty={form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}

function ProfileFooter(props: {
  status: FormStatus;
  pending: boolean;
  dirty: boolean;
}) {
  const missing = useMissingTranslations(PAIRS);
  return <FormFooter {...props} missing={missing} />;
}

function TextField({
  name,
  label,
  type = "text",
}: {
  name: "full_name" | "location" | "public_email" | "available_from";
  label: string;
  type?: string;
}) {
  const { register, formState } = useFormContext<ProfileValues>();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        aria-invalid={formState.errors[name] ? true : undefined}
        {...register(name)}
      />
    </div>
  );
}
