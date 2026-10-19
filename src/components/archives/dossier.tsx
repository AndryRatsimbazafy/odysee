import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Seal } from "@/components/engravings/seal";
import { Gloss } from "@/components/ui/gloss";
import { getPathname, Link } from "@/i18n/navigation";
import type { Emblem, Project, ProjectLink } from "@/lib/data/types";
import { roman } from "@/lib/format/roman";
import {
  CloseDossierButton,
  ContactFromDossierButton,
} from "./dossier-overlay";
import { PlateFigure } from "./plate";
import { PlateViewer } from "./plate-viewer";

const b = (chunks: ReactNode) => <b>{chunks}</b>;

type Mode = "page" | "overlay";

/**
 * The archive dossier (DESIGN §8, STORYBOARD §4): an opening composed by
 * `layout`, numbered sections, then contact and the other dossiers. The same
 * server component renders the full page and the intercepted overlay; only
 * the way out differs (links on the page, history in the dialog).
 */
export function Dossier({
  project: p,
  total,
  emblem,
  mode,
}: {
  project: Project;
  total: number;
  emblem: Emblem;
  mode: Mode;
}) {
  const t = useTranslations("dossier");
  const tv = useTranslations("voyage");
  const locale = useLocale();
  const todo = tv("todo");
  const or = (text: string) => text || <span className="todo">{todo}</span>;

  const Title = mode === "page" ? "h1" : "h2";
  // One level below the title, whichever it is (no skipped level, T25).
  const Sub = mode === "page" ? "h2" : "h3";
  const stamp = (
    <p className="kicker stamp">
      {t("stamp", { n: roman(p.index), kind: p.kindLabel || todo })}
      {p.isConfidential ? t("sealedSuffix") : null}
    </p>
  );
  const head = (
    <>
      <Title id={`dossier-${p.slug}`} className="d-title" tabIndex={-1}>
        {p.title}
      </Title>
      <p className="q">{p.quest ? t("quest", { text: p.quest }) : or("")}</p>
    </>
  );
  const facts = (
    <dl className="facts">
      <div>
        <dt>{t("facts.period")}</dt>
        <dd>{or(p.period)}</dd>
      </div>
      <div>
        <dt>{t("facts.role")}</dt>
        <dd>{or(p.roleShort)}</dd>
      </div>
      <div>
        <dt>{t("facts.team")}</dt>
        <dd>{or(p.team)}</dd>
      </div>
      {p.client || p.isConfidential ? (
        <div>
          <dt>{t("facts.client")}</dt>
          <dd>{p.client ?? t("facts.clientHidden")}</dd>
        </div>
      ) : null}
    </dl>
  );
  const decisions = p.decisions.length ? (
    <dl className="dec3">
      {p.decisions.map((d, i) =>
        !d.title && !d.why && !d.tradeoff ? (
          // One marker for a decision left entirely empty.
          <div key={i}>
            <dt className="todo">{todo}</dt>
          </div>
        ) : (
          <div key={i}>
            <dt>{or(d.title)}</dt>
            <dd>{or(d.why)}</dd>
            {d.tradeoff ? (
              <dd className="trade">
                <b>{t("tradeoff")}</b>
                {d.tradeoff}
              </dd>
            ) : null}
          </div>
        ),
      )}
    </dl>
  ) : (
    <p className="todo">{todo}</p>
  );
  const fig = (
    k: number,
    sizes: string,
    className?: string,
    priority?: boolean,
  ) => (
    <PlateFigure
      key={p.plates[k].id}
      plate={p.plates[k]}
      n={k + 1}
      emblem={emblem}
      sizes={sizes}
      className={
        isPortrait(p.plates[k].ratio)
          ? [className, "portrait"].filter(Boolean).join(" ")
          : className
      }
      priority={priority}
    />
  );

  // Opening, by layout. Plates it shows are not repeated in the plates section.
  let opening: ReactNode;
  let used: number[] = [];
  if (p.layout === "sealed") {
    opening = (
      <>
        {stamp}
        <div className="t">
          {head}
          {facts}
        </div>
        <aside className="pli">
          <Seal />
          <span className="kicker">{t("sealed.title")}</span>
          <p>{t("sealed.message")}</p>
          <div>
            <Contact mode={mode} label={t("sealed.cta")} />
          </div>
        </aside>
      </>
    );
  } else if (p.layout === "split") {
    used = [0, 1].filter((k) => k < p.plates.length);
    opening = (
      <>
        {stamp}
        <div className="t">{head}</div>
        <div className="meta">{facts}</div>
        {used.length ? (
          <div className="pair">
            {used.map((k) =>
              fig(k, "(max-width: 640px) 100vw, 50vw", undefined, true),
            )}
          </div>
        ) : null}
      </>
    );
  } else if (p.layout === "gallery") {
    used = p.plates.length ? [0] : [];
    opening = (
      <>
        {stamp}
        <div className="t">{head}</div>
        <div className="meta">{facts}</div>
        {used.length ? (
          <div className="hero-img">{fig(0, "100vw", undefined, true)}</div>
        ) : null}
      </>
    );
  } else {
    opening = (
      <>
        {stamp}
        <div className="t">
          {head}
          {facts}
        </div>
        <div className="first">
          <Sub>{t("sections.decisionsFirst")}</Sub>
          {decisions}
        </div>
      </>
    );
  }

  const rest = p.plates.map((_, k) => k).filter((k) => !used.includes(k));
  const sections: Record<
    string,
    { title: string; body: ReactNode; side?: ReactNode }
  > = {
    context: {
      title: t("sections.context"),
      body: (
        <>
          {p.context || p.problem ? (
            <>
              <p>{or(p.context)}</p>
              {p.problem ? <p className="big">{p.problem}</p> : null}
            </>
          ) : (
            <p className="todo">{todo}</p>
          )}
        </>
      ),
      side: <Gloss>{p.charonLine}</Gloss>,
    },
    contribution: {
      title: t("sections.contribution"),
      body: (
        <>
          <p className="big">{or(p.roleText)}</p>
          {p.contributions.length ? (
            <ul className="r-list">
              {p.contributions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : null}
        </>
      ),
    },
    decisions: { title: t("sections.decisions"), body: decisions },
    plates: {
      title: t(p.isConfidential ? "sections.platesSealed" : "sections.plates"),
      body: rest.length ? (
        <div className={`plates l-${p.layout}`}>
          {rest.map((k, j) =>
            fig(k, "(max-width: 760px) 100vw, 60vw", `p${j}`),
          )}
        </div>
      ) : (
        <p className="todo">{todo}</p>
      ),
    },
    results: {
      title: t("sections.results"),
      body: p.technologies.length ? (
        <ul className="r-list" aria-label={t("stackLabel")}>
          {p.technologies.map((tech) => (
            <li key={tech.name}>
              <b className="tech">{tech.name}</b>
              {tech.usage ? <span> — {tech.usage}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="todo">{todo}</p>
      ),
      // Nothing at all yet: a single marker, in the body.
      ...(!p.technologies.length && !p.results.length
        ? { body: <p className="todo">{t("resultsMissing")}</p> }
        : {}),
      side:
        !p.technologies.length && !p.results.length ? undefined : p.results
            .length ? (
          <ul className="r-list" aria-label={t("resultsLabel")}>
            {p.results.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="todo">{t("resultsMissing")}</p>
        ),
    },
  };
  const order =
    p.layout === "process"
      ? ["context", "contribution", "plates", "results"]
      : p.layout === "gallery"
        ? ["context", "plates", "contribution", "decisions", "results"]
        : ["context", "contribution", "decisions", "plates", "results"];

  const links = [
    p.links.demo ? { href: p.links.demo, label: t("links.demo") } : null,
    p.links.repo ? { href: p.links.repo, label: t("links.repo") } : null,
  ].filter((l) => l !== null);

  const other = (link: ProjectLink, dir: "prev" | "next") => {
    const label = (
      <>
        <span className="kicker">
          {t(`nav.${dir}`, { n: roman(link.index) })}
        </span>
        <b>{link.title}</b>
      </>
    );
    const className = dir === "next" ? "nx" : undefined;
    const href = `/projects/${link.slug}` as const;
    // On the full page a soft navigation would be intercepted into the
    // overlay: a plain link loads the other dossier as a page.
    return mode === "overlay" ? (
      <Link className={className} href={href} replace scroll={false}>
        {label}
      </Link>
    ) : (
      <a className={className} href={getPathname({ locale, href })}>
        {label}
      </a>
    );
  };

  return (
    <PlateViewer plates={p.plates} emblem={emblem} title={p.title}>
      <article className="dossier-body">
        <div className="d-bar gut">
          <p className="crumbs">
            <span className="hide-sm">
              {t.rich("crumb", { b, n: roman(p.index), total })}
            </span>
            <span className="show-sm">
              {t.rich("crumbShort", { b, n: roman(p.index), total })}
            </span>
          </p>
          {mode === "overlay" ? (
            <CloseDossierButton className="close">
              <span className="hide-sm">{t("close")}</span>
              <span className="show-sm" aria-hidden="true">
                {t("closeShort")}
              </span>
            </CloseDossierButton>
          ) : (
            <Link className="close" href="/#epreuves">
              {t("nav.back")}
            </Link>
          )}
        </div>

        <header className={`r-open gut o-${p.layout}`}>
          <div className="grid-12">{opening}</div>
        </header>

        {order.map((key, i) => {
          const s = sections[key];
          return (
            <section
              key={key}
              className="r-sec gut"
              aria-labelledby={`d-${p.slug}-${key}`}
            >
              <div className="grid-12">
                <div className="lbl">
                  <span className="n">{t("section", { n: i + 2 })}</span>
                  <Sub id={`d-${p.slug}-${key}`}>{s.title}</Sub>
                </div>
                {key === "plates" && rest.length ? (
                  s.body
                ) : (
                  <>
                    <div className="body">{s.body}</div>
                    {s.side ? <div className="side">{s.side}</div> : null}
                  </>
                )}
              </div>
            </section>
          );
        })}

        <footer className="r-close gut">
          <div className="grid-12">
            <div className="contact">
              <p>
                {p.isConfidential ? t("sealed.message") : t("contact.text")}
              </p>
              <div>
                <Contact
                  mode={mode}
                  label={p.isConfidential ? t("sealed.cta") : t("contact.cta")}
                />
              </div>
              {links.length ? (
                <ul className="links" aria-label={t("links.label")}>
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        className="btn ghost"
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <nav aria-label={t("nav.label")}>
              {p.previous ? other(p.previous, "prev") : <span />}
              {mode === "overlay" ? (
                <CloseDossierButton className="btn ghost">
                  {t("nav.back")}
                </CloseDossierButton>
              ) : (
                <Link className="btn ghost" href="/#epreuves">
                  {t("nav.back")}
                </Link>
              )}
              {p.next ? other(p.next, "next") : <span />}
            </nav>
          </div>
        </footer>
      </article>
    </PlateViewer>
  );
}

function Contact({ mode, label }: { mode: Mode; label: string }) {
  return mode === "overlay" ? (
    <ContactFromDossierButton>{label}</ContactFromDossierButton>
  ) : (
    <Link className="btn" href="/#hermes">
      {label}
    </Link>
  );
}

/** Tall plates (3:4, 4:5) would tower over their rank: their width is capped. */
const isPortrait = (ratio: string) => ratio === "3/4" || ratio === "4/5";
