"use client";

import { useRef, type ReactNode } from "react";
import {
  EASE,
  gsap,
  inView,
  MOTION_OK,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion/gsap";
import { scrollToSection } from "@/lib/motion/scroll";

/** Reading line: a preview is "being read" once its top passes 45 % of the viewport. */
const READ_AT = 0.45;

/**
 * Chant II and its motion (STORYBOARD §3). The chart is server-rendered;
 * here it is only measured: the boat sails the route as the archives are
 * read, the stop and leg being read light up (`on`), the previous ones are
 * `done`, and a stop or a legend entry jumps to its preview.
 */
export function VoyageStage({
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
      const svg = el?.querySelector<SVGSVGElement>(".carte svg");
      if (!el || !svg) return;
      const q = gsap.utils.selector(el);
      const previews = q(".pv") as HTMLElement[];
      const wrap = el.querySelector<HTMLElement>(".previews");
      const route = svg.querySelector<SVGPathElement>(".route");
      const boat = svg.querySelector<SVGGElement>(".boat");
      if (!wrap || !route || !boat) return;

      // Jumps: a stop on the chart or an entry of the legend.
      const onClick = (e: MouseEvent) => {
        const jump = (e.target as Element).closest<HTMLElement | SVGElement>(
          "[data-jump]",
        );
        const target =
          jump &&
          el.querySelector<HTMLElement>(`#traversee-${jump.dataset.jump}`);
        if (target) scrollToSection(target);
      };
      el.addEventListener("click", onClick);

      // Route length up to each stop, measured on the rendered legs.
      const stops = [0];
      for (const leg of svg.querySelectorAll<SVGPathElement>(".leg")) {
        stops.push(stops.at(-1)! + leg.getTotalLength());
      }
      const total = route.getTotalLength();

      // The boat: where it is on the route, which way its bow points (it
      // turns about when the leg heads west), and how much it heels.
      const boatAt = { len: 0, tilt: 0, flip: 1 };
      const draw = () => {
        const a = route.getPointAtLength(boatAt.len);
        boat.setAttribute(
          "transform",
          `translate(${a.x.toFixed(1)} ${(a.y - 4).toFixed(1)}) scale(${boatAt.flip} 1) rotate(${boatAt.tilt.toFixed(1)})`,
        );
      };
      /** Heel along the leg at this length, seen from the bow. */
      const course = (len: number) => {
        const a = route.getPointAtLength(len);
        const b = route.getPointAtLength(Math.min(total, len + 2));
        const flip = b.x < a.x ? -1 : 1;
        const angle =
          (Math.atan2(b.y - a.y, (b.x - a.x) * flip) * 180) / Math.PI;
        return { flip, tilt: Math.max(-25, Math.min(25, angle / 3)) };
      };

      // Current trial: 0 = still in port, n = reading preview n.
      let current = -1;
      const setEntry = (n: number) => {
        if (n === current) return;
        current = n;
        const state = (k: number) => (k === n ? "on" : k < n ? "done" : null);
        for (const node of svg.querySelectorAll<SVGElement>(".pt, .leg")) {
          const k = Number(node.dataset.jump ?? node.dataset.leg);
          const s = state(k);
          if (s) node.dataset.state = s;
          else delete node.dataset.state;
        }
        for (const btn of q(".legs button") as HTMLElement[]) {
          if (Number(btn.dataset.jump) === n)
            btn.setAttribute("aria-current", "true");
          else btn.removeAttribute("aria-current");
        }
        previews.forEach((pv, k) => {
          if (k + 1 === n) pv.dataset.on = "";
          else delete pv.dataset.on;
        });
      };

      const mm = gsap.matchMedia();
      // "all" keeps the callback running with reduced motion too (stops, no sailing).
      mm.add({ motion: MOTION_OK, all: "all" }, ({ conditions }) => {
        const motion = Boolean(conditions?.motion);
        // Heel eased on its own, so the boat does not snap at each stop.
        const heel = gsap.quickTo(boatAt, "tilt", {
          duration: 0.4,
          ease: "power3.out",
          onUpdate: draw,
        });
        const glide = gsap.quickTo(boatAt, "len", {
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => {
            const c = course(boatAt.len);
            boatAt.flip = c.flip;
            heel(c.tilt);
            draw();
          },
        });
        let docked = false;
        const sail = (target: number) => {
          const len = Math.max(0, Math.min(total, target));
          if (Math.abs(len - boatAt.len) < 0.3 && docked) return;
          if (!motion || !docked) {
            // First placement (or reduced motion): straight there, no crossing.
            docked = true;
            const c = course(len);
            Object.assign(boatAt, { len, ...c });
            glide(len, len);
            heel(c.tilt, c.tilt);
            draw();
            return;
          }
          glide(len);
        };

        // The logic of the prototype's updateVoyage: arrive at stop n when
        // preview n reaches the reading line, set sail for the next one in
        // the second half of the reading.
        const update = () => {
          const mid = innerHeight * READ_AT;
          let n = 0;
          let read = 0;
          let firstTop = 0;
          // Every read before any write (setEntry): no forced layout.
          previews.forEach((pv, k) => {
            const r = pv.getBoundingClientRect();
            if (!k) firstTop = r.top;
            if (r.top <= mid) {
              n = k + 1;
              read = Math.min(1, (mid - r.top) / Math.max(1, r.height));
            }
          });
          const past = wrap.getBoundingClientRect().bottom < mid;
          if (past) {
            setEntry(previews.length + 1);
            sail(total);
            return;
          }
          setEntry(n);
          if (!n) {
            // Leaving port as the first preview comes up.
            const f = Math.max(
              0,
              Math.min(1, 1 - (firstTop - mid) / innerHeight),
            );
            sail(motion ? stops[1] * f : 0);
            return;
          }
          const next =
            n < previews.length
              ? ((stops[n + 1] - stops[n]) * Math.max(0, read - 0.55)) / 0.45
              : 0;
          sail(motion ? stops[n] + next : stops[n]);
        };

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: update,
          onRefresh: update,
        });
        update();

        if (motion) {
          const map = el.querySelector(".carte");
          if (map && !inView(map)) {
            gsap
              .timeline({
                scrollTrigger: { trigger: map, start: "top 80%", once: true },
              })
              .from(q(".pt circle"), {
                scale: 0.6,
                opacity: 0,
                transformOrigin: "50% 50%",
                duration: 0.8,
                ease: EASE,
                stagger: 0.08,
              })
              .from(
                q(".leg"),
                {
                  opacity: 0,
                  duration: 0.8,
                  ease: "power1.out",
                  stagger: 0.06,
                },
                0.1,
              );
          }
          for (const pv of previews.filter((p) => !inView(p))) {
            gsap.from(pv.querySelectorAll(".vis, .txt > *"), {
              opacity: 0,
              y: 12,
              duration: 0.8,
              ease: EASE,
              stagger: 0.07,
              scrollTrigger: { trigger: pv, start: "top 82%", once: true },
            });
          }
          for (const wm of q(".pv .wm")) {
            gsap.fromTo(
              wm,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: wm.closest(".pv"),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              },
            );
          }
        }

        return () => trigger.kill();
      });

      return () => el.removeEventListener("click", onClick);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="epreuves"
      data-chant
      aria-labelledby={labelledBy}
      className="chant gut"
    >
      {children}
    </section>
  );
}
