import type { Metadata } from "next";
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
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
import { siteUrl } from "@/lib/seo/urls";
import { fontVariables } from "../fonts";
import "../globals.css";

// Only what Client Components read goes to the client (hero.identity: the
// Hermès letter; dossier.plate: the lightbox). The rest stays on the server,
// out of every page's payload (T25).
const CLIENT_NAMESPACES = ["voyage", "hermes", "lightbox"] as const;

async function clientMessages(locale: Locale) {
  const all = await getMessages({ locale });
  return {
    ...Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, all[ns]])),
    hero: { identity: all.hero.identity },
    dossier: { plate: all.dossier.plate },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Defaults for every page of a language; pages set their own title,
// canonical, hreflang and Open Graph (pageMetadata), so the 404 inherits none.
export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(siteUrl()),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  dossier,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, messages] = await Promise.all([
    getTranslations({ locale, namespace: "voyage" }),
    clientMessages(locale),
  ]);
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
        <NextIntlClientProvider messages={messages}>
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
