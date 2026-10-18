import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import {
  HammerEngraving,
  OliveEngraving,
} from "@/components/engravings/divine-emblems";
import { Marg } from "@/components/ui/marg";
import { RichEm } from "@/components/ui/rich-em";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getEngagements } from "@/lib/data/engagements";
import { getProfile } from "@/lib/data/profile";
import { getSkills } from "@/lib/data/skills";
import type { SkillDomain } from "@/lib/data/types";
import { DivinitesStage } from "./divinites-stage";

/** Chant I · Two gods (STORYBOARD §2): the craft, the counsel, off duty. */
export async function Divinites() {
  const locale = await getLocale();
  const [t, tv, profile, skills, engagements] = await Promise.all([
    getTranslations("divinites"),
    getTranslations("voyage"),
    getProfile(locale),
    getSkills(locale),
    getEngagements(locale),
  ]);

  const todo = <span className="todo">{tv("todo")}</span>;

  const god = (
    domain: SkillDomain,
    emblem: ReactNode,
    text: string | undefined,
    minor?: true,
  ) => {
    const items = skills.filter((s) => s.domain === domain);
    return (
      <article
        className={minor ? "god minor" : "god"}
        aria-labelledby={`god-${domain}`}
      >
        {emblem}
        <span className="kicker" data-rise>
          {t(`${domain}.kicker`)}
        </span>
        <h3 id={`god-${domain}`} className="display" data-rise>
          <RichEm text={t(`${domain}.title`)} />
        </h3>
        <p data-rise>{text || todo}</p>
        {items.length ? (
          <dl>
            {items.map((skill) => (
              <div key={skill.id}>
                <dt>{skill.label}</dt>
                <dd>{skill.description || todo}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="todo" data-rise>
            {tv("todo")}
          </p>
        )}
      </article>
    );
  };

  return (
    <DivinitesStage labelledBy="divinites-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.divinites.n")}
          folio={CHANTS.indexOf("divinites") + 1}
          note={t("epigraph")}
        />
        <header className="chant-head">
          <RevealTitle id="divinites-title" className="display">
            {tv("chants.divinites.title")}
          </RevealTitle>
          <p className="lead">{t("lead")}</p>
        </header>
        <div className="chant-body">
          <div className="duo">
            {god("hephaistos", <HammerEngraving />, profile?.hephaistos)}
            <div className="rule" aria-hidden="true">
              <span>{t("ampersand")}</span>
            </div>
            {god("athena", <OliveEngraving />, profile?.athena, true)}
          </div>

          <div className="agora">
            <span className="kicker">{t("agora")}</span>
            {engagements.length ? (
              <ul>
                {engagements.map((e) => (
                  <li key={e.id}>
                    <span className="it">
                      {e.url ? (
                        <a href={e.url} target="_blank" rel="noopener">
                          {e.text || e.organization}
                        </a>
                      ) : (
                        e.text || e.organization
                      )}
                    </span>
                    {e.roles.length ? (
                      <span className="mono">
                        {e.roles
                          .map((r) =>
                            r.period ? `${r.label} · ${r.period}` : r.label,
                          )
                          .join(" — ")}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              todo
            )}
          </div>
        </div>
      </div>
    </DivinitesStage>
  );
}
