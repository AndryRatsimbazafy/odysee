import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { Gloss } from "@/components/ui/gloss";
import { Marg } from "@/components/ui/marg";
import { CHANTS } from "@/components/voyage/chants";
import { Reveal } from "@/components/voyage/reveal/reveal";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { Route } from "@/components/voyage/route/route";

// Temporary scaffold (T04b, T13): one bare section per chant with its id,
// a revealed title and a route to the next, to exercise the compass, the
// index, anchor jumps and reveals. Replaced by the real chants from T14 on.

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const br = () => <br />;

export default function Home() {
  const t = useTranslations();

  return (
    <div className="gut flex flex-col gap-8 pb-16">
      <section
        id="embarcadere"
        data-chant
        data-hero
        className="min-h-svh pt-28"
      >
        <p className="font-mono">{t("hero.kicker")}</p>
        <h1>{t.rich("hero.fallback.tagline", { em })}</h1>
        <p>{t("hero.fallback.recit")}</p>
      </section>
      {CHANTS.slice(1).map((chant, i) => (
        <Fragment key={chant}>
          <Route from={CHANTS[i]} to={chant} />
          <section id={chant} data-chant className="min-h-[80svh]">
            <p className="kicker">{t(`voyage.chants.${chant}.n`)}</p>
            <RevealTitle className="display text-5xl">
              {t(`voyage.chants.${chant}.title`)}
            </RevealTitle>
            <Reveal className="mt-6 grid gap-2">
              <p>{t("voyage.folio", { n: i + 2 })}</p>
              <p>{t("divinites.lead")}</p>
              <p>{t("epreuves.lead")}</p>
            </Reveal>
          </section>
        </Fragment>
      ))}
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
      <RevealTitle className="display text-5xl">
        {t.rich("ithaque.title", { em, br })}
      </RevealTitle>
      <p>{t("notFound.title")}</p>
    </div>
  );
}
