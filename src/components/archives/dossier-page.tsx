"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, inView, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

/**
 * The dossier as a full page (direct load): its sections settle in as they
 * scroll into view, like the overlay's. What is on screen at load is left
 * as is, so nothing visible blinks.
 */
export function DossierPage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        for (const block of el.querySelectorAll(".r-sec, .r-close")) {
          if (inView(block)) continue;
          gsap.from(block.querySelectorAll(".grid-12 > *"), {
            opacity: 0,
            y: 16,
            duration: 0.8,
            ease: EASE,
            stagger: 0.08,
            scrollTrigger: { trigger: block, start: "top 85%", once: true },
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="dossier-page">
      {children}
    </div>
  );
}
