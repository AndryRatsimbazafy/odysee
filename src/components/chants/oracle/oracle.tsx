import { getLocale, getTranslations } from "next-intl/server";
import { Marg } from "@/components/ui/marg";
import { ChantStage } from "@/components/voyage/chant-stage";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getFaq } from "@/lib/data/faq";
import { getTestimonials } from "@/lib/data/testimonials";

/**
 * Chant V · The oracle (STORYBOARD §7): the recruiters' questions as native
 * details/summary, then the voices of Delphi, absent until a testimonial is
 * published.
 */
export async function Oracle() {
  const locale = await getLocale();
  const [t, tv, faq, voices] = await Promise.all([
    getTranslations("oracle"),
    getTranslations("voyage"),
    getFaq(locale),
    getTestimonials(locale),
  ]);

  return (
    <ChantStage id="oracle" labelledBy="oracle-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.oracle.n")}
          folio={CHANTS.indexOf("oracle") + 1}
          note={t("margin")}
        />
        <header className="chant-head">
          <RevealTitle id="oracle-title" className="display">
            {tv("chants.oracle.title")}
          </RevealTitle>
        </header>
        <div className="chant-body">
          <span className="qa-rule" data-trace aria-hidden="true" />
          {faq.length ? (
            <div className="qa" data-stagger>
              {faq.map((item, i) => (
                <details key={item.id} open={i === 0}>
                  <summary>{item.question || tv("todo")}</summary>
                  <p className="a">{item.answer || tv("todo")}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="todo">{tv("todo")}</p>
          )}

          {voices.length ? (
            <section className="delphes" aria-labelledby="delphes-title">
              <h3 id="delphes-title" className="kicker">
                {t("delphes")}
              </h3>
              <div data-stagger>
                {voices.map((v) => (
                  <figure key={v.id}>
                    <blockquote>
                      <p>{v.quote}</p>
                    </blockquote>
                    <figcaption>
                      <b>{v.author}</b>
                      {[v.role, v.company].filter(Boolean).join(" · ")}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </ChantStage>
  );
}
