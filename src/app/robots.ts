import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo/urls";

// Public site crawlable; admin, API, dev sheets and draft previews are not
// (SEO-05). Those pages also answer noindex themselves.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api/",
        "/dev/",
        ...routing.locales.map((locale) => `/${locale}/preview/`),
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
