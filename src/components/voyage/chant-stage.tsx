"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { EASE, gsap, inView, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

const RISE = 12;
const ONCE = { start: "top 80%", once: true } as const;

/**
 * A chant and its entrance (DESIGN §9), for chants whose motion is only
 * settling: margin and lead settle, the children of each `[data-stagger]`
 * group rise one after the other, each `[data-trace]` rule is drawn from
 * the left. Anything already on screen at setup is left as is.
 */
export function ChantStage({
  id,
  as: Tag = "section",
  labelledBy,
  className = "chant gut",
  children,
}: {
  id: string;
  as?: ElementType;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        const fresh = (target: Element | undefined): target is Element =>
          !!target && !inView(target);

        const head = q(".chant-head")[0];
        if (fresh(head)) {
          gsap.from(q(".marg > *, .chant-head .lead"), {
            opacity: 0,
            y: RISE,
            duration: 0.9,
            ease: EASE,
            stagger: 0.08,
            // Same start as the RevealTitle, so title and lead go together.
            scrollTrigger: { trigger: head, start: "top 85%", once: true },
          });
        }

        for (const rule of q("[data-trace]").filter(fresh)) {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.2,
            ease: EASE,
            scrollTrigger: { trigger: rule, ...ONCE },
          });
        }

        for (const group of q("[data-stagger]").filter(fresh)) {
          gsap.from(group.children, {
            opacity: 0,
            y: RISE,
            duration: 0.8,
            ease: EASE,
            stagger: 0.07,
            scrollTrigger: { trigger: group, ...ONCE },
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <Tag
      ref={root}
      id={id}
      data-chant
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </Tag>
  );
}
