"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion/gsap";
import { scrollToSection, setLenis } from "@/lib/motion/scroll";

/**
 * Damped scrolling (Lenis, driven by GSAP's ticker so ScrollTrigger stays in
 * step), off with reduced motion; and same-page anchor links that land below
 * the fixed header instead of under it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.95,
        autoRaf: false,
      });
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        setLenis(null);
        lenis.destroy();
      };
    });

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
      mm.revert();
    };
  }, []);

  return null;
}
