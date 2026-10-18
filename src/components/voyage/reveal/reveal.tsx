"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { EASE, gsap, inView, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

/**
 * Children that settle one after the other (DESIGN §9: stagger 60–90 ms)
 * when the group scrolls into view. Visible without JS, with reduced
 * motion, or if already on screen at load.
 */
export function Reveal({
  as: Tag = "div",
  className,
  stagger = 0.07,
  y = 18,
  children,
}: {
  as?: ElementType;
  className?: string;
  /** Seconds between two children. */
  stagger?: number;
  /** Starting offset in px. */
  y?: number;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || inView(el)) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(el.children, {
          opacity: 0,
          y,
          duration: 1.2,
          ease: EASE,
          stagger,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });
    },
    { scope: root, dependencies: [stagger, y] },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
