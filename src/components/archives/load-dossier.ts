import type { Locale } from "next-intl";
import { notFound, permanentRedirect } from "next/navigation";
import { assignEmblems } from "@/components/engravings/project-emblems";
import { getPathname } from "@/i18n/navigation";
import {
  getProject,
  getProjects,
  resolveSlugRedirect,
} from "@/lib/data/projects";

/**
 * A published dossier with its rank context (total, emblem as on the chart).
 * Unknown slug: the renamed project's URL (SEO-10), otherwise 404.
 */
export async function loadDossier(locale: Locale, slug: string) {
  const [project, projects] = await Promise.all([
    getProject(locale, slug),
    getProjects(locale),
  ]);
  if (!project) {
    const current = await resolveSlugRedirect(slug);
    if (current) {
      permanentRedirect(getPathname({ locale, href: `/projects/${current}` }));
    }
    notFound();
  }
  const emblems = assignEmblems(projects.map((p) => p.emblem));
  return {
    project,
    total: projects.length,
    emblem: emblems[project.index - 1],
  };
}
