"use client";

import type Lenis from "lenis";

// The page's Lenis instance (null with reduced motion or before mount), and
// anchor jumps that clear the fixed header (DESIGN §9).

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

/** Freezes the page under an overlay (index), with or without Lenis. */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("scroll-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

const headerHeight = () =>
  (document.querySelector<HTMLElement>(".top")?.offsetHeight ?? 72) + 8;

/** Smooth jump to a section, then focus it (keyboard and screen readers). */
export function scrollToSection(el: HTMLElement) {
  // A jump always leaves any overlay that froze the page (index).
  lockScroll(false);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const focus = () => {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  if (lenis) {
    // Lenis already honours the section's scroll-margin-top.
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    lenis.scrollTo(el, { offset: margin - headerHeight(), onComplete: focus });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduced ? "auto" : "smooth",
  });
  window.setTimeout(focus, reduced ? 0 : 900);
}
