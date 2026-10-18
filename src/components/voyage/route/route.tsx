"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";
import { CHANTS, type ChantId } from "../chants";

/**
 * Route between two chants (DESIGN §7): a dotted line, the course drawn
 * with the scroll and a small boat sailing it (scrub), towards the next
 * chant's name. Every other route sails right to left. Decorative only.
 */
export function Route({ from, to }: { from: ChantId; to: ChantId }) {
  const t = useTranslations("voyage");
  const root = useRef<HTMLDivElement>(null);
  const rtl = CHANTS.indexOf(from) % 2 === 1;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        const track = q(".track")[0] as HTMLElement;
        const scrub = {
          trigger: el,
          start: "top 92%",
          end: "top 45%",
          scrub: 1,
        };
        gsap.fromTo(
          q(".course"),
          { strokeDashoffset: 1 },
          // autoRound off: the dash is normalised (pathLength 1), whole
          // pixels would jump straight from undrawn to drawn.
          {
            strokeDashoffset: 0,
            ease: "none",
            autoRound: false,
            scrollTrigger: scrub,
          },
        );
        gsap.fromTo(
          q(".rb"),
          { x: 0 },
          {
            x: () => (rtl ? -1 : 1) * (track.clientWidth - 34),
            ease: "none",
            scrollTrigger: { ...scrub, invalidateOnRefresh: true },
          },
        );
        gsap.fromTo(
          q(".to"),
          { opacity: 0.25 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="route gut"
      data-rtl={rtl || undefined}
      aria-hidden="true"
    >
      <span className="from">{t(`chants.${from}.title`)}</span>
      <div className="track">
        <svg viewBox="0 0 1000 24" preserveAspectRatio="none">
          <path
            className="line soft dotted"
            vectorEffect="non-scaling-stroke"
            d="M0 12 H1000"
          />
          {/* No non-scaling-stroke here: Chrome then measures the
              pathLength dash on screen and the course runs ahead of the
              boat. The track is 24 px high for a 24-unit viewBox, so the
              stroke keeps its 1 px anyway. */}
          <path
            className="line course"
            pathLength={1}
            d={rtl ? "M1000 12 H0" : "M0 12 H1000"}
          />
        </svg>
        <svg className="rb line" viewBox="0 0 34 22">
          <path d="M2 14 Q17 21 32 12" />
          <path d="M2 14 Q0 10 3 8" />
          <path d="M17 15 V2" />
          <path d="M11 3 L23 3 L22 11 L12 11 Z" />
        </svg>
      </div>
      <span className="to">
        {t("route.to", {
          n: t(`chants.${to}.n`),
          title: t(`chants.${to}.title`),
        })}
      </span>
    </div>
  );
}
