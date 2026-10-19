"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { MOTION_OK, warmMotionOnIntent, whenMotion } from "@/lib/motion/gsap";
import { scrollToSection, setLenis } from "@/lib/motion/scroll";

/**
 * Damped scrolling (Lenis on its own frame loop, feeding ScrollTrigger once
 * GSAP is loaded), off with reduced motion; GSAP itself fetched at the
 * reader's first gesture; and same-page anchor links that land below the
 * fixed header instead of under it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const stopWarming = warmMotionOnIntent();

    const query = matchMedia(MOTION_OK);
    let stopLenis = () => {};
    const sync = () => {
      stopLenis();
      if (!query.matches) return;
      const lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.95,
        autoRaf: true,
      });
      const stopFeeding = whenMotion(({ ScrollTrigger }) =>
        lenis.on("scroll", ScrollTrigger.update),
      );
      setLenis(lenis);
      stopLenis = () => {
        stopFeeding();
        setLenis(null);
        lenis.destroy();
        stopLenis = () => {};
      };
    };
    sync();
    query.addEventListener("change", sync);

    // Capture phase: runs before the router's own link handling.
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const link = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash
      )
        return;
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;
      e.preventDefault();
      scrollToSection(target);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      query.removeEventListener("change", sync);
      stopLenis();
      stopWarming();
    };
  }, []);

  return null;
}
