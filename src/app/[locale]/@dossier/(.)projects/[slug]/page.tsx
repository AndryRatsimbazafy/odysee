import type { Locale } from "next-intl";
import { Dossier } from "@/components/archives/dossier";
import { loadDossier } from "@/components/archives/load-dossier";
import { routing } from "@/i18n/routing";
import { getDossierParams } from "@/lib/data/projects";

// "Lire les archives" from the page: the same dossier, intercepted into a
// full-screen dialog over the one-page (DESIGN §8). URL stays shareable.
// Published slugs are prerendered; the layout's Suspense only matters for any
// other one (no SEO stake here: a direct load renders the full page instead).

// Previous / next may wait for the next dossier: the current one stays on
// screen meanwhile (layout), which beats an empty dialog.
export const instant = false;

export async function generateStaticParams() {
  return getDossierParams(routing.locales);
}

export default async function DossierModal({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const { project, total, emblem } = await loadDossier(locale as Locale, slug);

  return (
    <Dossier project={project} total={total} emblem={emblem} mode="overlay" />
  );
}
