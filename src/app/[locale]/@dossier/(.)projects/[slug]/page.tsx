import type { Locale } from "next-intl";
import { Suspense } from "react";
import { Dossier } from "@/components/archives/dossier";
import { DossierOverlay } from "@/components/archives/dossier-overlay";
import { loadDossier } from "@/components/archives/load-dossier";
import { routing } from "@/i18n/routing";
import { getProjectSlugs } from "@/lib/data/projects";

// "Lire les archives" from the page: the same dossier, intercepted into a
// full-screen dialog over the one-page (DESIGN §8). URL stays shareable.
// Published slugs are prerendered; the Suspense only matters for any other
// one (no SEO stake here: a direct load renders the full page instead).

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default function DossierModal({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense>
      <Modal params={params} />
    </Suspense>
  );
}

async function Modal({
  params,
}: Pick<PageProps<"/[locale]/projects/[slug]">, "params">) {
  const { locale, slug } = await params;
  const { project, total, emblem } = await loadDossier(locale as Locale, slug);

  return (
    <DossierOverlay slug={project.slug}>
      <Dossier project={project} total={total} emblem={emblem} mode="overlay" />
    </DossierOverlay>
  );
}
