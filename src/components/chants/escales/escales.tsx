import { getLocale, getTranslations } from "next-intl/server";
import { Marg } from "@/components/ui/marg";
import { ChantStage } from "@/components/voyage/chant-stage";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getExperiences } from "@/lib/data/experiences";
import type { Experience } from "@/lib/data/types";

// The schema requires a start date: the seed uses this one for "unknown"
// (supabase/seed.sql). It is shown as [à fournir], never as a year.
const UNKNOWN_DATE = "2000-01-01";

/** Chant IV · Ports of call (STORYBOARD §6): the logbook, one row per port. */
export async function Escales() {
  const locale = await getLocale();
  const [t, tv, ports] = await Promise.all([
    getTranslations("escales"),
    getTranslations("voyage"),
    getExperiences(locale),
  ]);

  const todo = <span className="todo">{tv("todo")}</span>;
  const year = (date: string) => date.slice(0, 4);

  const period = (port: Experience) => {
    if (port.startDate === UNKNOWN_DATE || port.endDate === UNKNOWN_DATE) {
      return todo;
    }
    const start = year(port.startDate);
    if (!port.endDate) return `${start} – ${t("now")}`;
    const end = year(port.endDate);
    return end === start ? start : `${start} – ${end}`;
  };

  return (
    <ChantStage id="escales" labelledBy="escales-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.escales.n")}
          folio={CHANTS.indexOf("escales") + 1}
          note={t("margin")}
        />
        <header className="chant-head">
          <RevealTitle id="escales-title" className="display">
            {tv("chants.escales.title")}
          </RevealTitle>
          <p className="lead">{t("lead")}</p>
        </header>
        <div className="chant-body">
          <span className="log-rule" data-trace aria-hidden="true" />
          {ports.length ? (
            <table className="log">
              <caption className="sr-only">{t("margin")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("columns.period")}</th>
                  <th scope="col">{t("columns.port")}</th>
                  <th scope="col">{t("columns.role")}</th>
                  <th scope="col">{t("columns.entry")}</th>
                </tr>
              </thead>
              <tbody data-stagger>
                {ports.map((port) => {
                  const where = [
                    port.location,
                    port.isRemote ? t("remote") : null,
                  ].filter(Boolean);
                  return (
                    <tr key={port.id} data-now={!port.endDate || undefined}>
                      <td className="d">
                        {period(port)}
                        {!port.endDate ? (
                          <span className="now">{t("current")}</span>
                        ) : null}
                      </td>
                      <th scope="row" className="p">
                        {port.company || todo}
                        {where.length ? (
                          <small>{where.join(" · ")}</small>
                        ) : null}
                      </th>
                      <td className="r">{port.role || todo}</td>
                      <td className="e">
                        {port.message || todo}
                        {port.technologies.length ? (
                          <span className="tech">
                            {port.technologies.join(" · ")}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="todo">{tv("todo")}</p>
          )}
        </div>
      </div>
    </ChantStage>
  );
}
