"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion/gsap";
import { isBoarding, whenBoarded } from "@/components/voyage/loader/boarding";

// --ease (DESIGN §9), for the Web Animations API.
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The hero section and its motion, without GSAP (it stays off the first
 * load, T25). The opening (name letter by letter, then the rest in stagger)
 * only plays on the first visit: created paused behind the loader, so
 * nothing server-rendered ever blinks, played once it leaves; the h1 is
 * never hidden. The chart trace, the rocking ship and the chart turning
 * with the scroll are CSS (globals.css).
 */
export function HeroStage({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !isBoarding() || !matchMedia(MOTION_OK).matches) return;
    const rise = (
      selector: string,
      from: Keyframe,
      start: number,
      duration: number,
      stagger: number,
    ) =>
      Array.from(el.querySelectorAll(selector), (target, i) =>
        target.animate([from, { opacity: 1, transform: "none" }], {
          duration,
          delay: start + i * stagger,
          easing: EASE,
          fill: "backwards",
        }),
      );
    const opening = [
      ...rise(
        ".hero-name .l",
        { transform: "translateY(105%)" },
        150,
        1200,
        60,
      ),
      ...rise(
        "[data-intro]",
        { opacity: 0, transform: "translateY(14px)" },
        500,
        900,
        80,
      ),
      ...rise(
        ".fiche-id > div",
        { opacity: 0, transform: "translateY(16px)" },
        800,
        900,
        80,
      ),
    ];
    // Paused at 0, the backwards fill holds the starting state.
    opening.forEach((animation) => animation.pause());
    const stopWaiting = whenBoarded(() =>
      opening.forEach((animation) => animation.play()),
    );
    return () => {
      stopWaiting();
      opening.forEach((animation) => animation.cancel());
    };
  }, []);

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
