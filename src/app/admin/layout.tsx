import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-[15px] text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
