import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { roman } from "@/lib/format/roman";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Colophon. The Ithaque epilogue (T22) is composed above it. */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, year] = await Promise.all([
    getTranslations({ locale, namespace: "ithaque" }),
    currentYear(),
  ]);

  return (
    <footer className="gut">
      <div className="colophon mono">
        <span>{t("colophon")}</span>
        <span>{t("engravings", { year: roman(year) })}</span>
      </div>
    </footer>
  );
}
