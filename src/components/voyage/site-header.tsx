import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PortraitMark } from "@/components/engravings/portrait-mark";
import { LocaleSwitch } from "./locale-switch";
import { getResumeUrl } from "@/lib/data/resumes";
import { Link } from "@/i18n/navigation";
import { CharonToggle } from "./charon-toggle";
import { HeaderBar } from "./header-bar";
import { ThemeToggle } from "./theme-toggle";

const SHORTCUTS = ["epreuves", "escales", "hermes"] as const;

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [t, cv] = await Promise.all([
    getTranslations({ locale, namespace: "voyage.header" }),
    getResumeUrl(locale),
  ]);

  return (
    <HeaderBar>
      <Link className="brand" href="/#embarcadere" aria-label={t("home")}>
        <PortraitMark className="brand-mark" />
        <b>{t("brand")}</b>
        <span>{t("role")}</span>
      </Link>
      <div className="top-tools">
        <nav aria-label={t("navLabel")} className="top-nav">
          {SHORTCUTS.map((id) => (
            <Link key={id} href={`/#${id}`}>
              {t(`nav.${id}`)}
            </Link>
          ))}
        </nav>
        {cv ? (
          <a className="top-cv" href={cv} target="_blank" rel="noopener">
            {t("cv")}
          </a>
        ) : (
          <span className="top-cv off" title={t("cvMissingTitle")}>
            {t("cvMissing")}
          </span>
        )}
        <CharonToggle />
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </HeaderBar>
  );
}
