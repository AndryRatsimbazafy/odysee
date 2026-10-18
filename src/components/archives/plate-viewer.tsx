"use client";

import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { Emblem, Plate } from "@/lib/data/types";
import { EASE, gsap, MOTION_OK } from "@/lib/motion/gsap";
import { lockScroll } from "@/lib/motion/scroll";
import { PlateImage } from "./plate";

/** Horizontal travel (px) that turns a drag into previous / next. */
const SWIPE = 50;

/**
 * The dossier's lightbox (DESIGN §8, F-PRO-08). Any `[data-plate]` button
 * inside opens it on that figure: arrows, Escape, swipe, counter, focus kept
 * inside, and focus back on the figure when it closes. Rendered on <body>,
 * above the dossier, which goes inert meanwhile.
 */
export function PlateViewer({
  plates,
  emblem,
  title,
  children,
}: {
  plates: Plate[];
  emblem: Emblem;
  title: string;
  children: ReactNode;
}) {
  const t = useTranslations("lightbox");
  const tp = useTranslations("dossier.plate");
  const tv = useTranslations("voyage");
  const [index, setIndex] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const startX = useRef<number | null>(null);
  const total = plates.length;
  const open = index !== null;

  const show = (k: number) => setIndex(((k % total) + total) % total);
  const close = () => setIndex(null);

  function onClick(e: MouseEvent) {
    const button = (e.target as Element).closest<HTMLElement>("[data-plate]");
    if (!button) return;
    opener.current = button;
    show(Number(button.dataset.plate));
  }

  // Open: everything else goes inert and still; close gives it back and
  // returns focus to the figure that opened it.
  useEffect(() => {
    if (!open) return;
    const el = box.current;
    if (!el) return;
    const others = Array.from(document.body.children).filter(
      (other): other is HTMLElement =>
        other instanceof HTMLElement &&
        other !== el &&
        !other.inert &&
        other.localName !== "script" &&
        other.localName !== "next-route-announcer",
    );
    others.forEach((other) => (other.inert = true));
    // Over the overlay the page is already frozen: only undo what we did.
    const locked = document.documentElement.classList.contains("scroll-locked");
    if (!locked) lockScroll(true);
    el.querySelector<HTMLElement>(".lb-close")?.focus();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: EASE },
      );
    });

    return () => {
      mm.revert();
      others.forEach((other) => (other.inert = false));
      if (!locked) lockScroll(false);
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // Each figure fades and settles in (DESIGN §9: lightbox, fade + scale).
  useEffect(() => {
    const fig = box.current?.querySelector(".lb-fig .ph-img");
    if (!fig) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        fig,
        { opacity: 0, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.3, ease: EASE },
      );
    });
    return () => mm.revert();
  }, [index]);

  // Capture phase: runs before the dossier's own Escape (which then sees
  // defaultPrevented and stays open).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        setIndex((k) => (k === null ? k : (k + 1) % total));
      } else if (e.key === "ArrowLeft") {
        setIndex((k) => (k === null ? k : (k - 1 + total) % total));
      } else if (e.key === "Tab") {
        const focusables = Array.from(
          box.current?.querySelectorAll<HTMLElement>("button") ?? [],
        );
        if (!focusables.length) return;
        e.preventDefault();
        const at = focusables.indexOf(document.activeElement as HTMLElement);
        const step = e.shiftKey ? -1 : 1;
        const next = (at + step + focusables.length) % focusables.length;
        focusables[next].focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, total]);

  function onPointerDown(e: PointerEvent) {
    startX.current = e.clientX;
  }

  function onPointerUp(e: PointerEvent) {
    if (startX.current === null || index === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > SWIPE) show(index + (dx < 0 ? 1 : -1));
  }

  const plate = index === null ? null : plates[index];

  return (
    <div onClick={onClick}>
      {children}
      {plate && index !== null
        ? createPortal(
            <div
              ref={box}
              className="lb gut"
              role="dialog"
              aria-modal="true"
              aria-label={t("label")}
              data-lenis-prevent
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (startX.current = null)}
            >
              <div className="lb-top">
                <span className="mono">
                  {t("count", { n: index + 1, total })}
                </span>
                <button
                  type="button"
                  className="close lb-close"
                  onClick={close}
                >
                  {t("close")}
                </button>
              </div>
              <div className="lb-stage">
                {total > 1 ? (
                  <button
                    type="button"
                    className="lb-arrow lb-prev"
                    aria-label={t("prev")}
                    onClick={() => show(index - 1)}
                  >
                    ←
                  </button>
                ) : null}
                <figure
                  className="lb-fig"
                  style={{ "--r": ratioOf(plate.ratio) } as CSSProperties}
                >
                  <PlateImage
                    key={plate.id}
                    plate={plate}
                    n={index + 1}
                    emblem={emblem}
                    sizes="100vw"
                    priority
                  />
                </figure>
                {total > 1 ? (
                  <button
                    type="button"
                    className="lb-arrow lb-next"
                    aria-label={t("next")}
                    onClick={() => show(index + 1)}
                  >
                    →
                  </button>
                ) : null}
              </div>
              <p className="lb-cap" aria-live="polite">
                <span>
                  <b>{tp("fig", { n: index + 1 })}</b>
                  {" · "}
                  {plate.kind || tv("todo")} — {plate.caption || tv("todo")}
                </span>
                <span className="mono">{title}</span>
              </p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/** "16/10" → 1.6, for the figure's height cap. */
function ratioOf(ratio: Plate["ratio"]): number {
  const [w, h] = ratio.split("/").map(Number);
  return w / h;
}
