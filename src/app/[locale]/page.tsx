import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { LocaleSwitch } from "@/components/ui/locale-switch";

// Temporary i18n check page (T04b): unstyled list of the chants' titles and leads.
// Replaced by the real chants from T14 on.

const CHANTS = [
  "embarcadere",
  "divinites",
  "epreuves",
  "arsenal",
  "escales",
  "oracle",
  "hermes",
  "ithaque",
] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const br = () => <br />;

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex flex-col gap-8 p-8">
      <LocaleSwitch />
      <section>
        <p className="font-mono">{t("hero.kicker")}</p>
        <h1>{t.rich("hero.fallback.tagline", { em })}</h1>
        <p>{t("hero.fallback.recit")}</p>
      </section>
      <ol>
        {CHANTS.map((chant, i) => (
          <li key={chant} className="font-mono">
            {t(`voyage.chants.${chant}.n`)} · {t(`voyage.chants.${chant}.title`)} ·{" "}
            {t("voyage.folio", { n: i + 1 })}
          </li>
        ))}
      </ol>
      <p>{t("divinites.lead")}</p>
      <p>{t("epreuves.count", { count: 4 })}</p>
      <blockquote>{t("dossier.sealed.message")}</blockquote>
      <h2>{t.rich("ithaque.title", { em, br })}</h2>
      <p>{t("notFound.title")}</p>
    </main>
  );
}
