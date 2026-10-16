import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Gloss } from "@/components/voyage/gloss";
import { Marg } from "@/components/voyage/marg";

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
    <div className="gut flex flex-col gap-8 pb-16">
      <section data-hero className="min-h-svh pt-28">
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
      <section className="grid-12">
        <Marg
          chant={t("voyage.chants.divinites.n")}
          folio={2}
          note={t("divinites.lead")}
        />
        <div className="col-span-12 min-[821px]:col-span-9">
          <p>{t("divinites.lead")}</p>
          <Gloss>{t("hermes.charon")}</Gloss>
        </div>
      </section>
      <p>{t("epreuves.count", { count: 4 })}</p>
      <blockquote>{t("dossier.sealed.message")}</blockquote>
      <h2>{t.rich("ithaque.title", { em, br })}</h2>
      <p>{t("notFound.title")}</p>
    </div>
  );
}
