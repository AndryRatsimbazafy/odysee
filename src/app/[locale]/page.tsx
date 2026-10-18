import { Arsenal } from "@/components/chants/arsenal/arsenal";
import { Divinites } from "@/components/chants/divinites/divinites";
import { Epreuves } from "@/components/chants/epreuves/epreuves";
import { Embarcadere } from "@/components/chants/embarcadere/embarcadere";
import { Escales } from "@/components/chants/escales/escales";
import { Hermes } from "@/components/chants/hermes/hermes";
import { Ithaque } from "@/components/chants/ithaque/ithaque";
import { Oracle } from "@/components/chants/oracle/oracle";
import { Route } from "@/components/voyage/route/route";

/** The one-page: the chants in reading order, joined by routes. */
export default function Home() {
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
      <Hermes />
      <Route from="hermes" to="ithaque" />
      <Ithaque />
    </>
  );
}
