import { useTranslations } from "next-intl";
import { Arsenal } from "@/components/chants/arsenal/arsenal";
import { Divinites } from "@/components/chants/divinites/divinites";
import { Epreuves } from "@/components/chants/epreuves/epreuves";
import { Embarcadere } from "@/components/chants/embarcadere/embarcadere";
import { Escales } from "@/components/chants/escales/escales";
import { Ithaque } from "@/components/chants/ithaque/ithaque";
import { Oracle } from "@/components/chants/oracle/oracle";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { Route } from "@/components/voyage/route/route";

/** The one-page: the chants in reading order, joined by routes. */
export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Embarcadere />
      <Route from="embarcadere" to="divinites" />
      <Divinites />
      <Route from="divinites" to="epreuves" />
      <Epreuves />
      <Route from="epreuves" to="arsenal" />
      <Arsenal />
      <Route from="arsenal" to="escales" />
      <Escales />
      <Route from="escales" to="oracle" />
      <Oracle />
      <Route from="oracle" to="hermes" />
      {/* Chant VI · Écrire à Hermès arrives with T21. */}
      <section id="hermes" data-chant className="chant gut min-h-[60svh]">
        <p className="kicker">{t("voyage.chants.hermes.n")}</p>
        <RevealTitle className="display text-5xl">
          {t("voyage.chants.hermes.title")}
        </RevealTitle>
      </section>
      <Route from="hermes" to="ithaque" />
      <Ithaque />
    </>
  );
}
