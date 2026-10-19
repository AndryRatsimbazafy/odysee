"use client";

import { useEffect, useRef } from "react";
import type { ConstellationId } from "@/components/engravings/constellations";
import { whenIdle } from "@/lib/motion/gsap";
import { skyMarkup } from "./sky-markup";

/**
 * The night sky (DESIGN §6.1): fixed behind everything, decorative only.
 * Gradients are CSS (rendered without JS); stars and constellations are
 * drawn once the page is idle after hydration. Everything else is CSS
 * (globals.css), no GSAP: fade-in, the figures appearing once boarded,
 * drift and twinkling, and the scroll parallax (scroll-driven animations,
 * where supported). No loop ever runs inside an SVG.
 */
export function Sky({ names }: { names: Record<ConstellationId, string> }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      whenIdle(() => {
        if (root.current) root.current.innerHTML = skyMarkup(names);
      }),
    [names],
  );

  return <div ref={root} className="zodiac" aria-hidden="true" />;
}
