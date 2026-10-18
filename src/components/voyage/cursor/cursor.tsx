"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";

// Mouse only, never with reduced motion (DESIGN §6.3, §9).
const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
const subscribe = (onChange: () => void) => {
  const mql = matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const enabledNow = () => matchMedia(QUERY).matches;
const enabledOnServer = () => false;

type State = "link" | "view" | "text" | null;

const LINKS = "a, button, summary, label, [role='button']";
const FIELDS = "input, textarea, select, [contenteditable='true']";

/**
 * State under the pointer: an explicit data-cursor="link|view|text" wins
 * (data-cursor-label="open|zoom" names a view), then fields, then links.
 */
function stateOf(target: EventTarget | null): [State, string | null] {
  if (!(target instanceof Element)) return [null, null];
  const marked = target.closest<HTMLElement>("[data-cursor]");
  const value = marked?.dataset.cursor;
  if (value === "link" || value === "view" || value === "text") {
    return [
      value,
      value === "view" ? (marked?.dataset.cursorLabel ?? "open") : null,
    ];
  }
  if (target.closest(FIELDS)) return ["text", null];
  if (target.closest(LINKS)) return ["link", null];
  return [null, null];
}

/** Ring that trails the pointer, and a dot that follows it exactly. */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, enabledNow, enabledOnServer);
  return enabled ? <CursorLayer /> : null;
}

function CursorLayer() {
  const t = useTranslations("voyage.cursor");
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("cur");
    let mx = -100;
    let my = -100;
    let cx = -100;
    let cy = -100;
    let frame = 0;
    let last = 0;
    let shown = false;
    let current: string | null = null;

    // The ring eases towards the pointer, and stops when it gets there.
    // The step depends on elapsed time, so 120 Hz screens trail the same.
    const follow = (now: number) => {
      const k = 1 - Math.pow(1 - 0.18, Math.min(4, (now - last) / 16.67 || 1));
      last = now;
      cx += (mx - cx) * k;
      cy += (my - cy) * k;
      ring.current?.style.setProperty(
        "transform",
        `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`,
      );
      frame =
        Math.abs(mx - cx) + Math.abs(my - cy) > 0.2
          ? requestAnimationFrame(follow)
          : 0;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.current?.style.setProperty(
        "transform",
        `translate(${mx}px, ${my}px)`,
      );
      // Attributes only change with the state: no style work on plain moves.
      const [state, view] = stateOf(e.target);
      const key = `${state}:${view}`;
      if (!shown || key !== current) {
        shown = true;
        current = key;
        for (const el of [ring.current, dot.current]) {
          if (!el) continue;
          el.dataset.on = "";
          if (state) el.dataset.state = state;
          else delete el.dataset.state;
        }
        if (label.current) {
          label.current.textContent =
            view === "zoom" ? t("zoom") : view ? t("open") : "";
        }
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(follow);
      }
    };
    const onLeave = () => {
      shown = false;
      delete ring.current?.dataset.on;
      delete dot.current?.dataset.on;
    };

    addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      root.classList.remove("cur");
      cancelAnimationFrame(frame);
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [t]);

  return (
    <>
      <div ref={ring} className="cursor" aria-hidden="true">
        <i />
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
