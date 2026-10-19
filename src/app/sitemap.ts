import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjectRows } from "@/lib/data/projects";
import { homeLastModified } from "@/lib/seo/dates";
import { absoluteUrl, languagesFor } from "@/lib/seo/urls";

// Every canonical URL, in each language, with its hreflang set (SEO-03/04).
// Dates come from the data, never from the build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, projects] = await Promise.all([
    homeLastModified(),
    getProjectRows(),
  ]);
  const pages = [
    { href: "/", lastModified: home },
    ...projects.map((p) => ({
      href: `/projects/${p.slug}`,
      lastModified: p.updated_at,
    })),
  ];

  return pages.flatMap(({ href, lastModified }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      lastModified,
      alternates: { languages: languagesFor(href) },
    })),
  );
}
