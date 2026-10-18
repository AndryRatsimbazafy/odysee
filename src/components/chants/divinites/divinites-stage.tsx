"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, inView, MOTION_OK, useGSAP } from "@/lib/motion/gsap";

const ONCE = { start: "top 80%", once: true } as const;

/**
 * Chant I and its motion (STORYBOARD §2): margin and lead settle, each god's
 * emblem is traced then its text and list follow in stagger, the "&" rule
 * draws between them. Anything already on screen at setup is left as is.
 */
export function DivinitesStage({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION_OK, wide: "(min-width: 861px)" },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const q = gsap.utils.selector(el);
          const fresh = (target: Element) => !inView(target);

          const head = q(".chant-head")[0];
          if (head && fresh(head)) {
            gsap.from(q(".marg > *, .chant-head .lead"), {
              opacity: 0,
              y: 10,
              duration: 0.9,
              ease: EASE,
              stagger: 0.08,
              delay: 0.25,
              scrollTrigger: { trigger: head, ...ONCE },
            });
          }

          for (const god of q(".god").filter(fresh)) {
            const sel = gsap.utils.selector(god);
            gsap
              .timeline({
                defaults: { ease: EASE },
                scrollTrigger: { trigger: god, ...ONCE },
              })
              .fromTo(
                sel(".emb path"),
                { strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  duration: 1.6,
                  ease: "power2.inOut",
                  stagger: 0.05,
                  // The dash is normalised (pathLength 1): no pixel rounding.
                  autoRound: false,
                },
                0,
              )
              .from(
                sel("[data-rise]"),
                { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 },
                0.2,
              )
              .from(
                sel("dl > div"),
                { opacity: 0, y: 12, duration: 0.8, stagger: 0.07 },
                0.45,
              );
          }

          const rule = q(".duo .rule")[0];
          if (rule && fresh(rule)) {
            // Negative side insets keep the "&" (wider than the rule) uncut.
            const [from, to] = conditions.wide
              ? ["inset(0 -40px 100% -40px)", "inset(0 -40px 0% -40px)"]
              : ["inset(-40px 100% -40px 0)", "inset(-40px 0% -40px 0)"];
            gsap.fromTo(
              rule,
              { clipPath: from },
              {
                clipPath: to,
                duration: 1.4,
                ease: "power2.inOut",
                delay: 0.3,
                scrollTrigger: { trigger: rule, ...ONCE },
              },
            );
          }

          const agora = q(".agora")[0];
          if (agora && fresh(agora)) {
            gsap.from(agora.children, {
              opacity: 0,
              y: 12,
              duration: 0.8,
              ease: EASE,
              stagger: 0.08,
              scrollTrigger: { trigger: agora, start: "top 88%", once: true },
            });
          }
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="divinites"
      data-chant
      aria-labelledby={labelledBy}
      className="chant gut"
    >
      {children}
    </section>
  );
}
