import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { getSocialLinks } from "@/lib/data/social-links";
import { roman } from "@/lib/format/roman";
import { ConsoleGreeting } from "./console-greeting";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * Colophon of every page (STORYBOARD §9): © year, links, back to top. The
 * Ithaque epilogue is the last chant of the one-page, above it.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, tr, tv, year, links] = await Promise.all([
    getTranslations({ locale, namespace: "ithaque" }),
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "voyage" }),
    currentYear(),
    getSocialLinks(),
  ]);
  const github = links.find((l) => /github/i.test(l.platform))?.url ?? null;

  return (
    <footer className="gut">
      <div className="colophon mono">
        <span>{t("colophon")}</span>
        <span>{t("engravings", { year: roman(year) })}</span>
        <span>{t("copyright", { year })}</span>
        {links.length ? (
          <ul aria-label={t("links")}>
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noopener me">
                  {l.platform}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className="todo">{tv("todo")}</span>
        )}
        <a href="#main" className="to-top">
          {t("backToTop")}
        </a>
      </div>
      <ConsoleGreeting message={tr("console")} url={github} />
    </footer>
  );
}
