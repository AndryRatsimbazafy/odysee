"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { ConstellationId } from "@/components/engravings/constellations";
import { whenBoarded } from "../loader/boarding";
import { skyMarkup } from "./sky-markup";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The night sky (DESIGN §6.1): fixed behind everything, decorative only.
 * Gradients are CSS (rendered without JS); stars and constellations are
 * drawn on mount, then drift, twinkle and scroll at their own pace.
 * Only transform and opacity are animated.
 */
export function Sky({ names }: { names: Record<ConstellationId, string> }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      el.innerHTML = skyMarkup(names);
      const sky = el.querySelector("svg");
      if (!sky) return;

      // Reduced motion: the final, still sky (nothing below runs).
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(sky);

        // Opening: the figures fade in one after the other, once boarded.
        const opening = gsap.from(q(".cst"), {
          opacity: 0,
          duration: 1.6,
          ease: "power2.out",
          stagger: 0.12,
          paused: true,
        });
        const stopWaiting = whenBoarded(() => opening.play());

        // Parallax: the whole sky scrolls by, the star field a bit slower.
        gsap.to(sky, {
          y: () => -(sky.getBoundingClientRect().height - innerHeight) * 0.9,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(q(".field"), {
          y: 120,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 3 },
        });

        // Idle: slow drift and twinkling, each star layer at its own rhythm.
        // The figures stay put: inside the SVG every moving group repaints it.
        const idle: gsap.core.Animation[] = [
          gsap.to(sky, {
            x: -60,
            duration: 60,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }),
          gsap.to(q(".tw"), {
            opacity: 0.05,
            duration: 2.8,
            ease: "sine.inOut",
            stagger: { each: 0.05, from: "random", yoyo: true, repeat: -1 },
          }),
        ];
        q(".fl-s").forEach((g, n) => {
          idle.push(
            gsap.to(g, {
              x: [24, -30, 16][n],
              y: [-12, 18, -20][n],
              duration: [16, 22, 28][n],
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            }),
          );
        });

        // Hidden tab or scrolling: hold the idle loops, so the SVG is not
        // repainted for them while the page moves (scroll tweens go on).
        let scrolling = false;
        const sync = () =>
          idle.forEach((tween) => tween.paused(document.hidden || scrolling));
        const onScrollStart = () => {
          scrolling = true;
          sync();
        };
        const onScrollEnd = () => {
          scrolling = false;
          sync();
        };
        document.addEventListener("visibilitychange", sync);
        ScrollTrigger.addEventListener("scrollStart", onScrollStart);
        ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
        return () => {
          stopWaiting();
          document.removeEventListener("visibilitychange", sync);
          ScrollTrigger.removeEventListener("scrollStart", onScrollStart);
          ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
        };
      });
    },
    { scope: root, dependencies: [names], revertOnUpdate: true },
  );

  return <div ref={root} className="zodiac" aria-hidden="true" />;
}
