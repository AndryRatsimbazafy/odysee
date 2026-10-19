import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Base URL of the public site: the only source for canonical, hreflang,
// sitemap and OG URLs (ARCHITECTURE §7), so a custom domain is one variable.
export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing environment variable NEXT_PUBLIC_SITE_URL");
  }
  return "http://localhost:3000";
}

/** Absolute URL of a localized page (`href` without the locale prefix). */
export function absoluteUrl(locale: Locale, href: string): string {
  return siteUrl() + getPathname({ locale, href });
}

/** Locale whose page answers visitors matching neither language. */
const X_DEFAULT: Locale = "en";

/**
 * Canonical + hreflang of a page (SEO-03, SEO-12). Shared by the page metadata
 * and the sitemap so both always agree.
 */
export function alternatesFor(locale: Locale, href: string) {
  return {
    canonical: absoluteUrl(locale, href),
    languages: languagesFor(href),
  };
}

export function languagesFor(href: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, absoluteUrl(locale, href)]),
    ),
    "x-default": absoluteUrl(X_DEFAULT, href),
  };
}
