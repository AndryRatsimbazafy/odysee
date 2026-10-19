import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Dossier } from "@/components/archives/dossier";
import { DossierPage } from "@/components/archives/dossier-page";
import { loadDossier } from "@/components/archives/load-dossier";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";
import { getProject, getDossierParams } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, creativeWorkNode, graph } from "@/lib/seo/schema";

// Direct load, refresh or share of a dossier: the full page, server-rendered
// (F-PRO-07). In-site clicks are intercepted by @dossier instead.

// Published slugs are prerendered. Any other one may block: it must answer a
// real 404 or a 308 to the renamed slug (SEO-10), not a streamed page.
export const instant = false;

export async function generateStaticParams() {
  return getDossierParams(routing.locales);
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const project = await getProject(locale, slug);
  if (!project) return {};
  const { title, description } = await projectSeo(locale, project);
  return pageMetadata({
    locale,
    href: `/projects/${slug}`,
    title,
    description,
    article: { modifiedTime: project.updatedAt },
  });
}

/** The admin's SEO fields, else the dossier's own title and summary. */
async function projectSeo(locale: Locale, project: Project) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: project.seo.title || t("template", { title: project.title }),
    description: project.seo.description || project.summary,
    home: t("breadcrumb.home"),
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const { project, total, emblem } = await loadDossier(locale as Locale, slug);
  const { description, home } = await projectSeo(
    locale as Locale,
    project,
  );

  return (
    <DossierPage>
      <JsonLd
        data={graph(
          breadcrumbNode(locale as Locale, [
            { name: home, href: "/" },
            { name: project.title, href: `/projects/${project.slug}` },
          ]),
          creativeWorkNode(locale as Locale, project, description),
        )}
      />
      <Dossier project={project} total={total} emblem={emblem} mode="page" />
    </DossierPage>
  );
}
