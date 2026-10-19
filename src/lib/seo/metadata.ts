import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "./urls";

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/**
 * Metadata of a public page (SEO-02/03/12): title, description, canonical,
 * hreflang and Open Graph. A page's `openGraph` replaces the layout's whole,
 * so the shared fields are set here. The image comes from opengraph-image.
 */
export async function pageMetadata({
  locale,
  href,
  title,
  description,
  article,
}: {
  locale: Locale;
  href: string;
  title: string;
  description: string;
  article?: { modifiedTime: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = alternatesFor(locale, href);
  const shared = {
    siteName: t("siteName"),
    url: alternates.canonical,
    title,
    description,
    locale: OG_LOCALES[locale],
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => OG_LOCALES[l]),
  };

  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: article
      ? { ...shared, type: "article", modifiedTime: article.modifiedTime }
      : { ...shared, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
