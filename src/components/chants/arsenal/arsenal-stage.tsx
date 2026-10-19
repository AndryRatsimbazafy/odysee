"use client";

import { useRef, type ReactNode } from "react";
import { EASE, inView, MOTION_OK, useScrollScene } from "@/lib/motion/gsap";

const ONCE = { start: "top 80%", once: true } as const;
const RISE = 12;

/**
 * Chant III and its entrance (STORYBOARD §5, DESIGN §9): margin and lead
 * settle, the index lines rise in stagger while their leader dots run out,
 * the shrine's medallion is traced. Anything on screen at setup stays as is.
 */
export function ArsenalStage({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useScrollScene(
    ({ gsap }) => {
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
            scrollTrigger: { trigger: head, start: "top 85%", once: true },
          });
        }

        const index = q(".tindex")[0];
        if (fresh(index)) {
          gsap
            .timeline({ scrollTrigger: { trigger: index, ...ONCE } })
            .from(q(".tindex li"), {
              opacity: 0,
              y: RISE,
              duration: 0.8,
              ease: EASE,
              stagger: 0.06,
            })
            .from(
              q(".tindex .dots"),
              {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 0.9,
                ease: EASE,
                stagger: 0.06,
              },
              0.15,
            );
        }

        const shrine = q(".shrine")[0];
        if (fresh(shrine)) {
          gsap
            .timeline({
              defaults: { ease: EASE },
              scrollTrigger: { trigger: shrine, ...ONCE },
            })
            .fromTo(
              q(".shrine .medal path"),
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 1.6,
                ease: "power2.inOut",
                stagger: 0.04,
                autoRound: false,
              },
              0,
            )
            .from(
              q(".shrine > :not(svg)"),
              { opacity: 0, y: RISE, duration: 0.8, stagger: 0.07 },
              0.2,
            );
        }
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="arsenal"
      data-chant
      aria-labelledby={labelledBy}
      className="chant gut"
    >
      {children}
    </section>
  );
}
