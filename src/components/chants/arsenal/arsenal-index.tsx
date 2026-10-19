"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { WeaponMedallion } from "@/components/engravings/weapons";
import type { Weapon } from "@/lib/data/types";
import { MOTION_OK, useMotion } from "@/lib/motion/gsap";

export type Tool = {
  id: string;
  name: string;
  since: string;
  role: string;
  context: string;
  weapon: Weapon;
  /** « Instrument II · L'égide d'Athéna ». */
  kicker: string;
  /** « L'égide d'Athéna », the short kicker of the compact shrine. */
  weaponName: string;
  refs: { n: string; href: string; label: string }[];
};

/** Hover intent before a line opens: passing over the list moves nothing. */
const INTENT_MS = 120;

/**
 * Book index of the tools and the shrine of the active one (STORYBOARD §5).
 * One line is open at a time (role, context): the hovered one, otherwise the
 * active one. Focus or click makes a tool active, and its weapon is engraved
 * in the shrine (aria-live).
 */
export function ArsenalIndex({
  tools,
  indexLabel,
  refsLabel,
}: {
  tools: Tool[];
  indexLabel: string;
  refsLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const intent = useRef<number | undefined>(undefined);
  const shrine = useRef<HTMLElement>(null);
  // Tool already on show: the first one is drawn by the chant's entrance
  // (ArsenalStage), and React may run the effect twice on mount.
  const shown = useRef(0);
  const tool = tools[active];
  const open = hovered ?? active;

  useEffect(() => () => window.clearTimeout(intent.current), []);

  // Focus or click: that tool, and its line open, win over a stale hover.
  const choose = (i: number) => {
    window.clearTimeout(intent.current);
    setHovered(null);
    setActive(i);
  };

  // Mouse only: touch and pen go through focus / click.
  const hover = (i: number | null) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setHovered(i), INTENT_MS);
  };

  // A new active tool: its weapon is traced, its text settles. GSAP comes
  // with the chant's own scene; a change before that just shows the tool.
  useMotion(
    ({ gsap }) => {
      if (shown.current === active) return;
      shown.current = active;
      const el = shrine.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        gsap.fromTo(
          q(".weapon path"),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            stagger: 0.04,
            autoRound: false,
          },
        );
        // Explicit end values: never inherit a pending entrance state.
        gsap.fromTo(
          q("h3, p"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, ease: "expo.out", stagger: 0.05 },
        );
      });
    },
    { scope: shrine, when: "near", dependencies: [active] },
  );

  return (
    <div className="arsenal">
      <ul
        className="tindex"
        aria-label={indexLabel}
        onPointerLeave={(e) => e.pointerType === "mouse" && hover(null)}
      >
        {tools.map((t, i) => (
          <li
            key={t.id}
            data-open={i === open || undefined}
            onPointerEnter={(e) => e.pointerType === "mouse" && hover(i)}
          >
            {/* The fold stays out of the button: its name is tool + age. */}
            <button
              type="button"
              aria-pressed={i === active}
              aria-controls="shrine"
              onClick={() => choose(i)}
              onFocus={() => choose(i)}
            >
              <span className="row">
                <span className="nm">{t.name}</span>
                <span className="dots" aria-hidden="true" />
                <span className="since">{t.since}</span>
              </span>
            </button>
            <span className="refs">
              {t.refs.length ? (
                <>
                  <span className="sr-only">{refsLabel} : </span>
                  {t.refs.map((r, k) => (
                    <Fragment key={r.href}>
                      {k > 0 ? ", " : null}
                      <a href={r.href} aria-label={r.label} title={r.label}>
                        {r.n}
                      </a>
                    </Fragment>
                  ))}
                </>
              ) : (
                <span aria-hidden="true">—</span>
              )}
            </span>
            <div className="more">
              <p className="rl">{t.role}</p>
              <p className="ctx">{t.context}</p>
            </div>
          </li>
        ))}
      </ul>

      <aside id="shrine" ref={shrine} className="shrine" aria-live="polite">
        <span className="kicker">
          <span className="full">{tool.kicker}</span>
          <span className="short" aria-hidden="true">
            {tool.weaponName}
          </span>
        </span>
        <WeaponMedallion key={active} weapon={tool.weapon} className="medal" />
        <h3>{tool.name}</h3>
        <p className="mono">{tool.since}</p>
      </aside>
    </div>
  );
}
