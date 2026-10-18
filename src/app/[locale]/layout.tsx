import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CONSTELLATIONS } from "@/components/engravings/constellations";
import { Compass } from "@/components/voyage/compass/compass";
import { Cursor } from "@/components/voyage/cursor/cursor";
import { BOARDING_INIT_SCRIPT } from "@/components/voyage/loader/boarding";
import { Loader } from "@/components/voyage/loader/loader";
import { Sky } from "@/components/voyage/sky/sky";
import { ThemeProvider } from "@/components/voyage/theme-provider";
import { GLOSS_INIT_SCRIPT } from "@/components/voyage/gloss-store";
import { SiteFooter } from "@/components/voyage/site-footer";
import { SiteHeader } from "@/components/voyage/site-header";
import { SmoothScroll } from "@/components/voyage/smooth-scroll";
import { routing } from "@/i18n/routing";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({
  children,
  dossier,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "voyage" });
  const skyNames = Object.fromEntries(
    CONSTELLATIONS.map(({ id }) => [id, t(`sky.${id}`)]),
  ) as Record<(typeof CONSTELLATIONS)[number]["id"], string>;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        {/* Blocking, before first paint: re-applies a hidden-Charon choice. */}
        <script dangerouslySetInnerHTML={{ __html: GLOSS_INIT_SCRIPT }} />
        {/* Blocking, before first paint: flags the session's first visit so
            the loader shows (never without JS). */}
        <script dangerouslySetInnerHTML={{ __html: BOARDING_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a className="skip" href="#main">
          {t("skipLink")}
        </a>
        <NextIntlClientProvider>
          <ThemeProvider>
            <Sky names={skyNames} />
            <Loader />
            <SiteHeader locale={locale} />
            <Compass />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter locale={locale} />
            {/* Intercepted dossier (overlay), outside the page it makes inert. */}
            {dossier}
            <Cursor />
            <SmoothScroll />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
