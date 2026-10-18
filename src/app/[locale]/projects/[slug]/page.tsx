import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { Dossier } from "@/components/archives/dossier";
import { DossierPage } from "@/components/archives/dossier-page";
import { loadDossier } from "@/components/archives/load-dossier";
import { routing } from "@/i18n/routing";
import { getProject, getProjectSlugs } from "@/lib/data/projects";

// Direct load, refresh or share of a dossier: the full page, server-rendered
// (F-PRO-07). In-site clicks are intercepted by @dossier instead.

// Published slugs are prerendered. Any other one may block: it must answer a
// real 404 or a 308 to the renamed slug (SEO-10), not a streamed page.
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale as Locale, slug);
  if (!project) return {};
  return {
    title: project.seo.title || project.title,
    description: project.seo.description || project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const { project, total, emblem } = await loadDossier(locale as Locale, slug);

  return (
    <DossierPage>
      <Dossier project={project} total={total} emblem={emblem} mode="page" />
    </DossierPage>
  );
}
