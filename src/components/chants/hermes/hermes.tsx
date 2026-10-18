import { getLocale, getTranslations } from "next-intl/server";
import { Gloss } from "@/components/ui/gloss";
import { Marg } from "@/components/ui/marg";
import { ChantStage } from "@/components/voyage/chant-stage";
import { CHANTS } from "@/components/voyage/chants";
import { RevealTitle } from "@/components/voyage/reveal/reveal-title";
import { getProfile } from "@/lib/data/profile";
import { getSocialLinks } from "@/lib/data/social-links";
import { CopyEmail } from "./copy-email";
import { HermesForm } from "./hermes-form";

/**
 * Chant VI · Writing to Hermès (STORYBOARD §8): the letter on the left,
 * really sent by a Server Action; the direct ways on the right.
 */
export async function Hermes() {
  const locale = await getLocale();
  const [t, tv, th, profile, links] = await Promise.all([
    getTranslations("hermes"),
    getTranslations("voyage"),
    getTranslations("hero.identity"),
    getProfile(locale),
    getSocialLinks(),
  ]);
  const email = profile?.publicEmail;

  return (
    <ChantStage id="hermes" labelledBy="hermes-title">
      <div className="grid-12">
        <Marg
          chant={tv("chants.hermes.n")}
          folio={CHANTS.indexOf("hermes") + 1}
          note={t("margin")}
        />
        <header className="chant-head">
          <RevealTitle id="hermes-title" className="display">
            {tv("chants.hermes.title")}
          </RevealTitle>
        </header>
        <div className="chant-body letter">
          <HermesForm locale={locale} />
          <aside className="contact-side" data-stagger>
            <span className="kicker">{t("direct")}</span>
            {email ? (
              <CopyEmail email={email} />
            ) : (
              <p className="todo">{tv("todo")}</p>
            )}
            <p className="mono contact-links">
              {links.length ? (
                links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="me noopener"
                  >
                    {link.platform}
                  </a>
                ))
              ) : (
                <span className="todo">{th("linksMissing")}</span>
              )}
            </p>
            <Gloss>{t("charon")}</Gloss>
          </aside>
        </div>
      </div>
    </ChantStage>
  );
}
