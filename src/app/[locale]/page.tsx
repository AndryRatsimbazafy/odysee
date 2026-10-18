import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { Divinites } from "@/components/chants/divinites/divinites";
import { Epreuves } from "@/components/chants/epreuves/epreuves";
import { Embarcadere } from "@/components/chants/embarcadere/embarcadere";
import { Gloss } from "@/components/ui/gloss";
import { Marg } from "@/components/ui/marg";
import { CHANTS } from "@/components/voyage/chants";
import { Reveal } from "@/components/voyage/reveal/reveal";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { Route } from "@/components/voyage/route/route";

// Temporary scaffold (T04b, T13): one bare section per chant (from chant III) with its id,
// a revealed title and a route to the next, to exercise the compass, the
// index, anchor jumps and reveals. Replaced by the real chants from T14 on.

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const br = () => <br />;

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Embarcadere />
      <Route from="embarcadere" to="divinites" />
      <Divinites />
      <Route from="divinites" to="epreuves" />
      <Epreuves />
      <div className="gut flex flex-col gap-8 pb-16">
        {CHANTS.slice(3).map((chant, i) => (
          <Fragment key={chant}>
            <Route from={CHANTS[i + 2]} to={chant} />
            <section id={chant} data-chant className="min-h-[80svh]">
              <p className="kicker">{t(`voyage.chants.${chant}.n`)}</p>
              <RevealTitle className="display text-5xl">
                {t(`voyage.chants.${chant}.title`)}
              </RevealTitle>
              <Reveal className="mt-6 grid gap-2">
                <p>{t("voyage.folio", { n: i + 4 })}</p>
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
        <RevealTitle className="display text-5xl">
          {t.rich("ithaque.title", { em, br })}
        </RevealTitle>
        <p>{t("notFound.title")}</p>
      </div>
    </>
  );
}
