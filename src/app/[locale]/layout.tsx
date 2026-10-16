import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/voyage/theme-provider";
import { GLOSS_INIT_SCRIPT } from "@/components/voyage/gloss-store";
import { SiteFooter } from "@/components/voyage/site-footer";
import { SiteHeader } from "@/components/voyage/site-header";
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
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "voyage" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        {/* Blocking, before first paint: re-applies a hidden-Charon choice. */}
        <script dangerouslySetInnerHTML={{ __html: GLOSS_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a className="skip" href="#main">
          {t("skipLink")}
        </a>
        <NextIntlClientProvider>
          <ThemeProvider>
            <SiteHeader locale={locale} />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter locale={locale} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
