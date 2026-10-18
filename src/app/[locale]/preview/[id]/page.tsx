import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Dossier } from "@/components/archives/dossier";
import { DossierPage } from "@/components/archives/dossier-page";
import { assignEmblems } from "@/components/engravings/project-emblems";
import { getAdmin } from "@/lib/auth/admin";
import { getProjectPreview } from "@/lib/data/admin";
import { getProjects } from "@/lib/data/projects";

// Admin-only preview of any project, draft included, as its real dossier
// (F-ADM-09). Reached through /api/draft, which turns Draft Mode on.

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Cache Components prerenders a shell per param: one placeholder id gives the
// layout a known path; real ids render on demand behind the Suspense below.
// Admin-only, never prefetched from the site: blocking is fine.
export const instant = false;

export function generateStaticParams() {
  return [{ id: "draft" }];
}

export default function PreviewPage({
  params,
}: PageProps<"/[locale]/preview/[id]">) {
  return (
    <Suspense>
      <Preview params={params} />
    </Suspense>
  );
}

async function Preview({
  params,
}: Pick<PageProps<"/[locale]/preview/[id]">, "params">) {
  const [{ locale, id }, draft, admin] = await Promise.all([
    params,
    draftMode(),
    getAdmin(),
  ]);
  if (!draft.isEnabled || !admin) notFound();

  const [project, projects, t] = await Promise.all([
    getProjectPreview(locale as Locale, id),
    getProjects(locale as Locale),
    getTranslations("dossier"),
  ]);
  if (!project) notFound();

  // A draft is not on the chart yet: show it as if published last.
  const draftRank = project.index > 0 ? null : projects.length + 1;
  const shown = draftRank ? { ...project, index: draftRank } : project;
  const emblems = assignEmblems([
    ...projects.map((p) => p.emblem),
    project.emblem,
  ]);

  return (
    <DossierPage>
      <p className="kicker preview-flag gut">{t("preview")}</p>
      <Dossier
        project={shown}
        total={draftRank ?? projects.length}
        emblem={emblems[shown.index - 1]}
        mode="page"
      />
    </DossierPage>
  );
}
