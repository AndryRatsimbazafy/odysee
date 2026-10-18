"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/admin/button";
import { FormFooter, type FormStatus } from "@/components/admin/form-footer";
import { ImageField } from "@/components/admin/image-field";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/admin/tabs";
import { deleteProject, saveProject } from "@/lib/actions/projects";
import type { TechnologyOption } from "@/lib/data/admin";
import {
  missingByTab,
  PROJECT_STATUSES,
  PROJECT_TABS,
  projectSchema,
  tabOfField,
  type ProjectTab,
  type ProjectValues,
} from "@/lib/validation/projects";
import { SelectField } from "./fields";
import { PlatesTab } from "./plates-tab";
import { SheetTab } from "./sheet-tab";
import { StackTab } from "./stack-tab";
import { WorkTab } from "./work-tab";

const errorTabs = (errors: FieldErrors<ProjectValues>) =>
  new Set(Object.keys(errors).map(tabOfField));

export function ProjectForm({
  projectId,
  defaultValues,
  redirects: initialRedirects,
  technologies,
  mediaBaseUrl,
}: {
  projectId: string;
  defaultValues: ProjectValues;
  redirects: string[];
  technologies: TechnologyOption[];
  mediaBaseUrl: string;
}) {
  const t = useTranslations("admin.projects");
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });
  const [tab, setTab] = useState<ProjectTab>("story");
  const [redirects, setRedirects] = useState(initialRedirects);
  const [savedSlug, setSavedSlug] = useState(defaultValues.slug);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  // Reveal the first tab holding an error (hidden tabs cannot show it).
  function showErrors(errors: FieldErrors<ProjectValues>) {
    const tabs = errorTabs(errors);
    const first = PROJECT_TABS.find((name) => tabs.has(name));
    if (first) setTab(first);
    setStatus("invalid");
  }

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveProject(projectId, values);
        if (result.ok) {
          form.reset(result.data.values);
          setRedirects(result.data.redirects);
          setSavedSlug(result.data.values.slug);
          setStatus("saved");
        } else if (result.error === "slugTaken") {
          form.setError("slug", { type: "slugTaken" });
          setTab("sheet");
          setStatus("invalid");
        } else setStatus(result.error);
      }),
    showErrors,
  );

  function onDelete() {
    if (!window.confirm(t("edit.confirmDelete"))) return;
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (!result.ok) setDeleteFailed(true);
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="grid gap-8">
        <header className="grid gap-4">
          <Link
            href="/admin/projects"
            className="mono text-muted-foreground hover:text-foreground"
          >
            {t("edit.back")}
          </Link>
          <Heading />
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-44">
              <SelectField
                path="status"
                label={t("status.label")}
                options={PROJECT_STATUSES.map((value) => ({
                  value,
                  label: t(`status.${value}`),
                }))}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled
              aria-describedby="preview-soon"
            >
              {t("edit.preview")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="ml-auto text-destructive"
              disabled={pending}
              onClick={onDelete}
            >
              {t("edit.delete")}
            </Button>
          </div>
          <p id="preview-soon" className="text-sm text-muted-foreground">
            {t("edit.previewSoon")}
          </p>
          {deleteFailed && (
            <p aria-live="polite" className="text-sm text-destructive">
              {t("edit.deleteFailed")}
            </p>
          )}
        </header>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as ProjectTab)}
          className="gap-8"
        >
          <ProjectTabsList />
          {/* forceMount: hidden tabs keep their fields (and errors) mounted. */}
          <TabsContent
            value="story"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <StoryTab />
          </TabsContent>
          <TabsContent
            value="sheet"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <SheetTab
              projectId={projectId}
              savedSlug={savedSlug}
              redirects={redirects}
              onRedirectRemoved={(slug) =>
                setRedirects((list) => list.filter((s) => s !== slug))
              }
            />
          </TabsContent>
          <TabsContent
            value="work"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <WorkTab />
          </TabsContent>
          <TabsContent
            value="plates"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <PlatesTab projectId={projectId} mediaBaseUrl={mediaBaseUrl} />
          </TabsContent>
          <TabsContent
            value="stack"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <StackTab options={technologies} />
          </TabsContent>
          <TabsContent
            value="seo"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <SeoTab projectId={projectId} mediaBaseUrl={mediaBaseUrl} />
          </TabsContent>
        </Tabs>

        <ProjectFooter
          status={status}
          pending={pending}
          dirty={form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}

function Heading() {
  const t = useTranslations("admin.projects");
  const { control } = useFormContext<ProjectValues>();
  const title = useWatch({ control, name: "title_fr" });
  return (
    <h1 className="display text-4xl break-words">{title || t("untitled")}</h1>
  );
}

/** Tab triggers with their missing translations and error marks. */
function ProjectTabsList() {
  const t = useTranslations("admin.projects.tabs");
  const { control, formState } = useFormContext<ProjectValues>();
  const values = useWatch({ control }) as ProjectValues;
  const missing = missingByTab(values);
  const errors = errorTabs(formState.errors);

  return (
    <TabsList
      variant="line"
      aria-label={t("label")}
      className="h-auto w-full flex-wrap justify-start border-b border-border"
    >
      {PROJECT_TABS.map((name) => (
        <TabsTrigger key={name} value={name} className="flex-none px-3">
          {t(name)}
          {missing[name] > 0 && (
            <span className="mono text-todo">{missing[name]}</span>
          )}
          {errors.has(name) && (
            <span className="text-destructive">
              <span aria-hidden>•</span>
              <span className="sr-only">{t("hasErrors")}</span>
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

function StoryTab() {
  const t = useTranslations("admin.projects.fields");
  return (
    <div className="grid gap-8">
      <BilingualField fr="title_fr" en="title_en" label={t("title")} />
      <BilingualField
        fr="short_title_fr"
        en="short_title_en"
        label={t("shortTitle")}
        maxLength={60}
      />
      <BilingualField
        fr="quest_fr"
        en="quest_en"
        label={t("quest")}
        multiline
        rows={2}
      />
      <BilingualField
        fr="charon_line_fr"
        en="charon_line_en"
        label={t("charonLine")}
        multiline
        rows={2}
      />
      <BilingualField
        fr="summary_fr"
        en="summary_en"
        label={t("summary")}
        multiline
        rows={3}
      />
      <BilingualField
        fr="context_fr"
        en="context_en"
        label={t("context")}
        multiline
        rows={6}
      />
      <BilingualField
        fr="problem_fr"
        en="problem_en"
        label={t("problem")}
        multiline
        rows={6}
      />
    </div>
  );
}

function SeoTab({
  projectId,
  mediaBaseUrl,
}: {
  projectId: string;
  mediaBaseUrl: string;
}) {
  const t = useTranslations("admin.projects.seo");
  return (
    <div className="grid gap-8">
      <BilingualField
        fr="seo_title_fr"
        en="seo_title_en"
        label={t("title")}
        maxLength={70}
      />
      <BilingualField
        fr="seo_description_fr"
        en="seo_description_en"
        label={t("description")}
        multiline
        rows={3}
        maxLength={170}
      />
      <ImageField
        name="og_image_path"
        label={t("ogImage")}
        baseUrl={mediaBaseUrl}
        projectId={projectId}
      />
      <p className="text-sm text-muted-foreground">{t("ogImageHint")}</p>
    </div>
  );
}

function ProjectFooter(props: {
  status: FormStatus;
  pending: boolean;
  dirty: boolean;
}) {
  const { control } = useFormContext<ProjectValues>();
  const values = useWatch({ control }) as ProjectValues;
  const missing = Object.values(missingByTab(values)).reduce(
    (a, b) => a + b,
    0,
  );
  return <FormFooter {...props} missing={missing} />;
}
