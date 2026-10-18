import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/voyage/theme-provider";
import { fontVariables } from "../fonts";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin");
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

// Root layout for the admin, outside the i18n tree (FR only, DESIGN §11):
// same tokens and fonts as the site, no narrative layer.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Client components only need the admin texts.
  const { admin } = await getMessages();

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-[15px] text-foreground">
        <NextIntlClientProvider messages={{ admin }}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
