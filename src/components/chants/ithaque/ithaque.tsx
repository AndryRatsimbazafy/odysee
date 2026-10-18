import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { IthaqueCoast } from "@/components/engravings/ithaque-coast";
import { ChantStage } from "@/components/voyage/chant-stage";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getResumeUrl } from "@/lib/data/resumes";

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const br = () => <br />;

/**
 * Epilogue · The return to Ithaca (STORYBOARD §9): the coast comes into
 * view, the next port of call is "your team", and two ways to get there.
 */
export async function Ithaque() {
  const locale = await getLocale();
  const [t, th, cv] = await Promise.all([
    getTranslations("ithaque"),
    getTranslations("voyage.header"),
    getResumeUrl(locale),
  ]);

  return (
    <ChantStage id="ithaque" labelledBy="ithaque-title" className="ithaque gut">
      <div data-draw>
        <IthaqueCoast className="coast" />
      </div>
      <div className="grid-12">
        <span className="kicker">{t("kicker")}</span>
        <RevealTitle id="ithaque-title" className="display">
          {t.rich("title", { em, br })}
        </RevealTitle>
        <div className="act" data-stagger>
          <p>{t("text")}</p>
          <div>
            <a className="btn" href="#hermes">
              {t("cta")}
            </a>
            {cv ? (
              <a className="btn ghost" href={cv} target="_blank" rel="noopener">
                {th("cv")}
              </a>
            ) : (
              <span
                className="btn ghost off"
                aria-disabled="true"
                title={th("cvMissingTitle")}
              >
                {th("cvMissing")}
              </span>
            )}
          </div>
        </div>
      </div>
    </ChantStage>
  );
}
