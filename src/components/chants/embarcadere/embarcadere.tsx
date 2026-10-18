import type { ReactNode } from "react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { ChartMedallion } from "@/components/engravings/chart-medallion";
import { RichEm } from "@/components/ui/rich-em";
import { getProfile } from "@/lib/data/profile";
import { getResumeUrl } from "@/lib/data/resumes";
import { getSocialLinks } from "@/lib/data/social-links";
import { Clock } from "./clock";
import { HeroStage } from "./hero-stage";

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Departure · The landing stage (STORYBOARD §1). */
export async function Embarcadere() {
  const locale = await getLocale();
  const [t, format, profile, links, cv] = await Promise.all([
    getTranslations("hero"),
    getFormatter(),
    getProfile(locale),
    getSocialLinks(),
    getResumeUrl(locale),
  ]);

  const name = profile?.fullName ?? t("fallback.name");
  const title = profile?.title || t("fallback.title");
  const location = profile?.location || t("fallback.location");
  const available = profile?.isAvailable ?? true;

  return (
    <HeroStage labelledBy="hero-title">
      <div className="grid-12">
        <div className="hero-id">
          <span className="kicker" data-intro>
            {t("kicker", { title })}
          </span>
          <p className="hero-name display">
            <span className="sr-only">{name}</span>
            <span aria-hidden="true">
              {Array.from(name).map((letter, i) => (
                <span key={i} className="l">
                  {letter}
                </span>
              ))}
            </span>
          </p>
          <h1 id="hero-title" className="hero-tagline display">
            {profile?.tagline ? (
              <RichEm text={profile.tagline} />
            ) : (
              t.rich("fallback.tagline", { em })
            )}
          </h1>
          <p className="hero-recit" data-intro>
            {profile?.recit || t("fallback.recit")}
          </p>
          <div className="hero-ctas" data-intro>
            <a className="btn" href="#epreuves">
              {t("ctaWork")}
            </a>
            <a className="btn ghost" href="#hermes">
              {t("ctaWrite")}
            </a>
          </div>
        </div>

        <figure className="chart" aria-label={t("chart.label")}>
          <ChartMedallion
            labels={{
              city: t("chart.city"),
              coords: t("chart.coords"),
              meridian: t("chart.meridian"),
              lat: [t("chart.lat1"), t("chart.lat2")],
            }}
          />
          <figcaption className="mono">{t("chart.caption")}</figcaption>
        </figure>

        <dl className="fiche-id" aria-label={t("identity.label")}>
          <div>
            <dt>{t("identity.role")}</dt>
            <dd>
              {title}
              <br />
              <span className="mono">{t("identity.focus")}</span>
            </dd>
          </div>
          <div>
            <dt>{t("identity.port")}</dt>
            <dd>
              {location}
              <br />
              <span className="mono">
                {t("chart.coords")}{" "}
                <span className="whitespace-nowrap">
                  · <Clock /> {t("identity.timezone")}
                </span>
              </span>
            </dd>
          </div>
          <div>
            <dt>{t("identity.availability")}</dt>
            <dd className={available ? "on" : undefined}>
              {available
                ? profile?.availability || t("identity.available")
                : t("identity.unavailable")}
              {available ? (
                <>
                  <br />
                  {profile?.availableFrom ? (
                    <span className="mono">
                      {t("identity.availableFrom", {
                        date: format.dateTime(new Date(profile.availableFrom), {
                          dateStyle: "long",
                        }),
                      })}
                    </span>
                  ) : (
                    <span className="todo">{t("identity.dateMissing")}</span>
                  )}
                </>
              ) : null}
            </dd>
          </div>
          <div>
            <dt>{t("identity.contact")}</dt>
            <dd>
              <a className="hero-write" href="#hermes">
                {t("identity.writeHermes")}
              </a>
              <br />
              <span className="mono hero-links">
                {cv ? (
                  <a href={cv} target="_blank" rel="noopener">
                    {t("identity.cv")}
                  </a>
                ) : (
                  <span className="todo">{t("identity.cvMissing")}</span>
                )}
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
                  <span className="todo">{t("identity.linksMissing")}</span>
                )}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </HeroStage>
  );
}
