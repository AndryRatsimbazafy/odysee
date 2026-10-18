"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { FormSection } from "@/components/admin/form-section";
import { deleteSlugRedirect } from "@/lib/actions/projects";
import {
  PROJECT_EMBLEMS,
  PROJECT_KINDS,
  PROJECT_LAYOUTS,
  type ProjectValues,
} from "@/lib/validation/projects";
import { CheckField, SelectField, TextField } from "./fields";

export function SheetTab({
  projectId,
  savedSlug,
  redirects,
  onRedirectRemoved,
}: {
  projectId: string;
  /** Slug as last saved: a different one will leave a redirect behind. */
  savedSlug: string;
  redirects: string[];
  onRedirectRemoved: (slug: string) => void;
}) {
  const t = useTranslations("admin.projects.fields");
  const { control, setValue, formState } = useFormContext<ProjectValues>();
  const [slug, confidential] = useWatch({
    control,
    name: ["slug", "is_confidential"],
  });
  const slugTaken = formState.errors.slug?.type === "slugTaken";

  // A sealed dossier is the expected layout of a confidential project, and
  // it publishes no links (they are also nulled on save).
  function onConfidential(checked: boolean) {
    if (!checked) return;
    setValue("layout", "sealed", { shouldDirty: true });
    setValue("demo_url", "", { shouldDirty: true });
    setValue("repo_url", "", { shouldDirty: true });
  }

  return (
    <div className="grid gap-10">
      <FormSection title={t("slug")}>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField
            path="slug"
            label={t("slug")}
            hint={
              slugTaken
                ? t("slugTaken")
                : slug !== savedSlug && savedSlug
                  ? t("slugChange", { old: savedSlug })
                  : t("slugHint", { slug: slug || "…" })
            }
          />
        </div>
        {redirects.length > 0 && (
          <RedirectList
            projectId={projectId}
            redirects={redirects}
            onRemoved={onRedirectRemoved}
          />
        )}
      </FormSection>

      <FormSection title={t("layout")}>
        <CheckField
          path="is_confidential"
          label={t("confidential")}
          onChecked={onConfidential}
        />
        {confidential && (
          <p className="text-sm text-muted-foreground">
            {t("confidentialHint")}
          </p>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField
            path="layout"
            label={t("layout")}
            options={PROJECT_LAYOUTS.map((value) => ({
              value,
              label: t(`layouts.${value}`),
            }))}
          />
          <SelectField
            path="emblem"
            label={t("emblem")}
            options={[
              { value: "", label: t("emblemAuto") },
              ...PROJECT_EMBLEMS.map((value) => ({
                value,
                label: t(`emblems.${value}`),
              })),
            ]}
          />
          <SelectField
            path="kind"
            label={t("kind")}
            options={PROJECT_KINDS.map((value) => ({
              value,
              label: t(`kinds.${value}`),
            }))}
          />
        </div>
        <BilingualField
          fr="kind_label_fr"
          en="kind_label_en"
          label={t("kindLabel")}
        />
      </FormSection>

      <FormSection title={t("role")}>
        <BilingualField fr="period_fr" en="period_en" label={t("period")} />
        <BilingualField fr="role_fr" en="role_en" label={t("role")} />
        <BilingualField
          fr="role_label_fr"
          en="role_label_en"
          label={t("roleLabel")}
          multiline
        />
        <BilingualField fr="team_fr" en="team_en" label={t("team")} />
      </FormSection>

      <FormSection title={t("client")}>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField path="client_name" label={t("clientName")} />
        </div>
        {!confidential && (
          <CheckField path="show_client" label={t("showClient")} />
        )}
      </FormSection>

      {!confidential && (
        <FormSection title={t("links")}>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              path="demo_url"
              label={t("demoUrl")}
              type="url"
              inputMode="url"
              placeholder="https://"
            />
            <TextField
              path="repo_url"
              label={t("repoUrl")}
              type="url"
              inputMode="url"
              placeholder="https://"
            />
          </div>
        </FormSection>
      )}
    </div>
  );
}

function RedirectList({
  projectId,
  redirects,
  onRemoved,
}: {
  projectId: string;
  redirects: string[];
  onRemoved: (slug: string) => void;
}) {
  const t = useTranslations("admin.projects.fields");
  const tf = useTranslations("admin.form");
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">{t("redirects")}</h3>
      <ul className="grid gap-1">
        {redirects.map((old) => (
          <li key={old} className="mono flex items-center gap-2">
            /{old}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={pending}
              aria-label={t("removeRedirect", { slug: old })}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteSlugRedirect(projectId, old);
                  setFailed(!result.ok);
                  if (result.ok) onRemoved(old);
                })
              }
            >
              <X aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      {failed && (
        <p aria-live="polite" className="text-sm text-destructive">
          {tf("failed")}
        </p>
      )}
    </div>
  );
}
