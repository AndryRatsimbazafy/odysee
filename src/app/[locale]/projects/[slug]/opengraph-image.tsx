import type { Locale } from "next-intl";
import { assignEmblems, EMBLEMS } from "@/components/engravings/project-emblems";
import { getProject, getProjects } from "@/lib/data/projects";
import { roman } from "@/lib/format/roman";
import {
  isOgReadable,
  ogAlt,
  ogMessages,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogPlate,
  ogUploaded,
} from "@/lib/seo/og";
import { siteUrl } from "@/lib/seo/urls";

// Share image of a dossier, per language (SEO-07): its title, quest and the
// emblem it carries on the chart.

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { params: Promise<{ locale: string; slug: string }> };

// Unlike Image, generateImageMetadata receives plain params (not a promise).
export async function generateImageMetadata({
  params,
}: {
  params?: { locale?: string; slug?: string };
}) {
  const { locale, slug } = params ?? {};
  const project =
    locale && slug ? await getProject(locale as Locale, slug) : null;
  const alt = await ogAlt(locale, project?.title);
  return [{ id: "dossier", alt, size, contentType }];
}

export default async function Image({ params }: Params) {
  const { locale: requested, slug } = await params;
  const { locale, t } = ogMessages(requested);
  const [project, projects] = await Promise.all([
    getProject(locale, slug),
    getProjects(locale),
  ]);

  if (project && isOgReadable(project.seo.ogImage)) {
    return ogUploaded(project.seo.ogImage);
  }

  const emblems = assignEmblems(projects.map((p) => p.emblem));
  const emblem = project ? emblems[project.index - 1] : undefined;
  return ogPlate({
    kicker: project
      ? t("og.kickerProject", { n: roman(project.index) })
      : t("og.kickerHome"),
    title: project?.title || t("og.fallbackTitle"),
    subtitle: project?.quest || project?.summary,
    footer: new URL(siteUrl()).host,
    engraving: {
      viewBox: "0 0 160 100",
      strokes: EMBLEMS[emblem ?? assignEmblems([null])[0]],
    },
  });
}
