"use client";

import { useEffect, useRef } from "react";
import { finishBoarding, isBoarding } from "./boarding";

// Minimum time on screen, counted from navigation start (the loader is
// painted with the page), and the CSS fade durations.
const MIN_MS = 1400;
const MIN_MS_REDUCED = 400;
const FADE_MS = 900;
const FADE_MS_REDUCED = 300;
// Same as the CSS safety: the loader never outlives it.
const SAFETY_MS = 8000;

/** Real progress (window load + fonts), then the loader leaves. */
export function LoaderBar() {
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isBoarding()) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let steps = 0;
    let done = false;
    const step = () => {
      steps++;
      bar.current?.style.setProperty(
        "transform",
        `scaleX(${Math.min(1, 0.08 + steps * 0.3)})`,
      );
    };
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else addEventListener("load", () => resolve(), { once: true });
    }).then(step);
    const fonts = document.fonts.ready.then(step);
    const safety = new Promise<void>((resolve) =>
      setTimeout(resolve, SAFETY_MS - performance.now()),
    );

    let timer: number | undefined;
    void Promise.race([Promise.all([loaded, fonts]), safety]).then(() => {
      if (done) return;
      step();
      const wait = (reduced ? MIN_MS_REDUCED : MIN_MS) - performance.now();
      timer = window.setTimeout(
        () => finishBoarding(reduced ? FADE_MS_REDUCED : FADE_MS),
        Math.max(0, wait),
      );
    });
    return () => {
      done = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bar" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}
