"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, MOTION_OK, useGSAP } from "@/lib/motion/gsap";
import { isBoarding, whenBoarded } from "@/components/voyage/loader/boarding";

/**
 * The hero section and its motion. The opening (name letter by letter, then
 * the rest in stagger) only plays on the first visit, behind the loader, so
 * nothing server-rendered ever blinks; the h1 is never hidden. The chart
 * trace is CSS. Here also: the ship rocks, the chart turns with the scroll.
 */
export function HeroStage({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        let stopWaiting = () => {};

        if (isBoarding()) {
          const opening = gsap
            .timeline({ paused: true })
            .from(
              q(".hero-name .l"),
              { yPercent: 105, duration: 1.2, ease: EASE, stagger: 0.06 },
              0.15,
            )
            .from(
              q("[data-intro]"),
              { opacity: 0, y: 14, duration: 0.9, ease: EASE, stagger: 0.08 },
              0.5,
            )
            .from(
              q(".fiche-id > div"),
              { opacity: 0, y: 16, duration: 0.9, ease: EASE, stagger: 0.08 },
              0.8,
            );
          stopWaiting = whenBoarded(() => opening.play());
        }

        gsap.to(q(".ship"), {
          y: -3,
          rotation: 0.8,
          svgOrigin: "150 170",
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(q(".chart svg"), {
          rotation: -8,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        return () => stopWaiting();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="embarcadere"
      data-chant
      data-hero
      aria-labelledby={labelledBy}
      className="hero gut"
    >
      {children}
    </section>
  );
}
