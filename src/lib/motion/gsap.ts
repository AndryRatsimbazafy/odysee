"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

// GSAP is motion, never content: it is fetched on first need (a scene near
// the viewport, an overlay), not on the hydration path (T25: mobile TBT).
// Without it, everything is already in its final, readable state.

export type Motion = {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ScrollTriggerType;
};

let motion: Motion | null = null;
let loading: Promise<Motion> | null = null;
const waiting = new Set<(m: Motion) => void>();

/** GSAP with ScrollTrigger registered, loaded once. */
export function loadMotion(): Promise<Motion> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      motion = { gsap, ScrollTrigger };
      waiting.forEach((fn) => fn(motion!));
      waiting.clear();
      return motion;
    },
  );
  return loading;
}

/** GSAP if it is already here (cosmetic touches that may be skipped). */
export const loadedMotion = () => motion;

/** Runs `fn` once GSAP is here, without fetching it. Returns a cancel. */
export function whenMotion(fn: (m: Motion) => void): () => void {
  if (motion) {
    fn(motion);
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}

/** Fetches GSAP at the reader's first gesture (scroll, touch, key, click). */
export function warmMotionOnIntent(): () => void {
  const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"];
  const warm = () => {
    stop();
    void loadMotion();
  };
  const stop = () =>
    events.forEach((type) => removeEventListener(type, warm, true));
  events.forEach((type) =>
    addEventListener(type, warm, { capture: true, passive: true }),
  );
  return stop;
}

/** Runs `fn` at an idle moment after hydration. Returns a cancel. */
export function whenIdle(fn: () => void): () => void {
  // Safari has no requestIdleCallback.
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(fn, { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 300);
  return () => window.clearTimeout(id);
}

/** House curve for reveals (DESIGN §9, --ease ≈ expo.out). */
export const EASE = "expo.out";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Already on screen at setup: left as is, so nothing visible blinks. */
export const inView = (el: Element) =>
  el.getBoundingClientRect().top < window.innerHeight;

/** `sync`: GSAP was already here, the setup runs before the first paint. */
type Setup = (m: Motion, sync: boolean) => void | (() => void);

type Options = {
  scope: RefObject<Element | null>;
  /** "now": on mount; "near": once idle, then close to the viewport. */
  when?: "now" | "near";
  /** A change reverts the previous run and runs the setup again. */
  dependencies?: DependencyList;
};

/**
 * Our useGSAP: the setup runs in a gsap.context scoped to `scope`, reverted
 * on unmount, once GSAP is loaded. Nothing animates until then.
 */
export function useMotion(
  setup: Setup,
  { scope, when = "now", dependencies = [] }: Options,
) {
  useLayoutEffect(() => {
    let ctx: ReturnType<Motion["gsap"]["context"]> | undefined;
    let done = false;
    const run = (m: Motion, sync: boolean) => {
      if (done) return;
      ctx = m.gsap.context(() => setup(m, sync), scope.current ?? undefined);
    };
    const start = () => {
      if (motion) run(motion, false);
      else void loadMotion().then((m) => run(m, false));
    };

    let cancel = () => {};
    if (when === "now") {
      if (motion) run(motion, true);
      else start();
    } else {
      let observer: IntersectionObserver | undefined;
      const watch = () => {
        const el = scope.current;
        if (!el) return;
        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer?.disconnect();
            start();
          },
          // A quarter screen ahead: with GSAP warmed up by the first scroll
          // (warmMotionOnIntent), that is enough; an untouched page never
          // fetches it.
          { rootMargin: "25% 0px" },
        );
        observer.observe(el);
      };
      // Idle first, unless GSAP is already here (a re-run on a change).
      let stopIdle = () => {};
      if (motion) watch();
      else stopIdle = whenIdle(watch);
      cancel = () => {
        stopIdle();
        observer?.disconnect();
      };
    }

    return () => {
      done = true;
      cancel();
      ctx?.revert();
    };
    // The caller's dependencies, like useGSAP's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

/**
 * Scroll scenes: set up once the page is idle and the scene is close to the
 * viewport, so far scenes (and GSAP itself) cost nothing
 * until the reader heads there. Scenes keep their inView guard: anything
 * already on screen at setup is left as is.
 */
export function useScrollScene(setup: Setup, options: Omit<Options, "when">) {
  useMotion(setup, { ...options, when: "near" });
}
