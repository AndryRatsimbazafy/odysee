import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { PlateImage } from "@/components/archives/plate";
import { assignEmblems } from "@/components/engravings/project-emblems";
import { Gloss } from "@/components/ui/gloss";
import { Marg } from "@/components/ui/marg";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/data/projects";
import type { Emblem, ProjectSummary } from "@/lib/data/types";
import { roman } from "@/lib/format/roman";
import { VoyageChart } from "./voyage-chart";
import { VoyageStage } from "./voyage-stage";

const b = (chunks: ReactNode) => <b>{chunks}</b>;

/** Chant II · The trials (STORYBOARD §3): the crossing chart and the archives. */
export async function Epreuves() {
  const locale = await getLocale();
  const [t, tv, projects] = await Promise.all([
    getTranslations("epreuves"),
    getTranslations("voyage"),
    getProjects(locale),
  ]);
  const emblems = assignEmblems(projects.map((p) => p.emblem));

  const thumb = (p: ProjectSummary, emblem: Emblem) => {
    const plate = p.firstPlate;
    const kind = plate?.kind || tv("todo");
    return (
      <>
        <PlateImage
          plate={plate}
          n={1}
          emblem={emblem}
          sizes="(max-width: 900px) 100vw, 45vw"
        />
        <p className="ph-cap">
          <span>
            {t.rich("preview.dossier", { b, n: roman(p.index), kind })}
          </span>
          <span>{p.period || tv("todo")}</span>
        </p>
      </>
    );
  };

  return (
    <VoyageStage labelledBy="epreuves-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.epreuves.n")}
          folio={CHANTS.indexOf("epreuves") + 1}
          note={t("count", { count: projects.length })}
        />
        <header className="chant-head">
          <RevealTitle id="epreuves-title" className="display">
            {tv("chants.epreuves.title")}
          </RevealTitle>
          <p className="lead">{t("lead")}</p>
        </header>

        {projects.length ? (
          <div className="voyage">
            <div
              className={projects.length > 6 ? "carte tall" : "carte"}
              aria-label={t("map.label")}
              role="group"
            >
              <VoyageChart
                points={projects.map((p) => ({
                  n: roman(p.index),
                  label: p.shortTitle,
                }))}
                labels={{
                  title: t("map.title"),
                  port: t("map.port"),
                  north: t("map.north"),
                }}
              />
              <ol
                className={
                  projects.length > 6
                    ? "legs compact"
                    : projects.length > 4
                      ? "legs many"
                      : "legs"
                }
              >
                {projects.map((p) => (
                  <li key={p.id}>
                    <button type="button" data-jump={p.index} title={p.title}>
                      <span className="n">{roman(p.index)}</span>
                      <span className="t">{p.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="mono hint">{t("map.hint")}</p>
            </div>

            <div className="previews">
              {projects.map((p, i) => (
                <article
                  key={p.id}
                  id={`traversee-${p.index}`}
                  className={i % 2 ? "pv alt" : "pv"}
                  aria-labelledby={`pv-${p.index}`}
                >
                  <div className="vis">{thumb(p, emblems[i])}</div>
                  <div className="txt">
                    <p className="stamp">
                      <b>{t("preview.stamp", { n: roman(p.index) })}</b>
                      <span className="mono">{p.kindLabel}</span>
                    </p>
                    <h3 id={`pv-${p.index}`} className="display">
                      {p.title}
                    </h3>
                    <p className="sum">{p.summary || tv("todo")}</p>
                    {p.stack.length ? (
                      <ul className="stk" aria-label={t("preview.stack")}>
                        {p.stack.slice(0, 5).map((name) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    ) : null}
                    {p.isConfidential ? (
                      <p className="seal">{t("preview.sealed")}</p>
                    ) : null}
                    <div>
                      <Link className="btn ghost" href={`/projects/${p.slug}`}>
                        {t("preview.open")}
                      </Link>
                    </div>
                    <Gloss>{p.charonLine}</Gloss>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="chant-body todo">{t("empty")}</p>
        )}
      </div>
    </VoyageStage>
  );
}
