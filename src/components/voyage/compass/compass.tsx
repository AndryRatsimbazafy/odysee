"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { lockScroll } from "@/lib/motion/scroll";
import { CharonToggle } from "../charon-toggle";
import { CHANTS } from "../chants";
import { LocaleSwitch } from "../locale-switch";
import { ThemeToggle } from "../theme-toggle";

const STEP = 360 / CHANTS.length;

/**
 * Index of the chant whose top has passed 45 % of the viewport, or -1 off
 * the one-page (a dossier page has no chant).
 */
function currentChant(): number {
  if (!CHANTS.some((id) => document.getElementById(id))) return -1;
  const line = window.innerHeight * 0.45;
  let current = 0;
  CHANTS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = i;
  });
  const bottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4;
  if (bottom) {
    const last = CHANTS.findLastIndex((id) => document.getElementById(id));
    if (last >= 0) current = last;
  }
  return current;
}

/**
 * Compass rose (DESIGN §6.4): its needle points at the current chant; it
 * opens the index of chants, a full-screen overlay with a focus trap,
 * Escape to close, and Lenis paused (data-lenis-prevent) while open.
 */
export function Compass() {
  const t = useTranslations("voyage");
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rose = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Closing by following a link: focus goes to the section, not the rose.
  const returnFocus = useRef(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCurrent(currentChant());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
    // A soft navigation (one-page ↔ dossier page) changes the sections.
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const button = rose.current;
    lockScroll(true);
    const links = panel.current?.querySelectorAll<HTMLElement>("a, button");
    const start =
      panel.current?.querySelector<HTMLElement>("[aria-current='true']") ??
      links?.[0];
    const focusTimer = window.setTimeout(() => start?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [
        ...panel.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      if (returnFocus.current) button?.focus();
      returnFocus.current = true;
    };
  }, [open]);

  const chant = current >= 0 ? CHANTS[current] : null;
  const title = chant ? t(`chants.${chant}.title`) : t("index.label");

  return (
    <>
      <button
        ref={rose}
        type="button"
        className="rose"
        aria-controls="index"
        aria-expanded={open}
        aria-label={chant ? t("rose.current", { title }) : t("rose.open")}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g className="line">
            <circle className="ring" cx="50" cy="50" r="47" />
            <circle className="fine" cx="50" cy="50" r="42" />
            <g className="fine">
              {CHANTS.map((id, i) => (
                <path
                  key={id}
                  transform={`rotate(${i * STEP} 50 50)`}
                  d={`M50 4 V${i === 0 ? 13 : 10}`}
                />
              ))}
            </g>
            <g
              className="needle"
              style={{ transform: `rotate(${Math.max(0, current) * STEP}deg)` }}
            >
              <path className="north" d="M50 12 L55 50 L50 56 L45 50 Z" />
              <path className="soft" d="M50 88 L55 50 L50 44 L45 50 Z" />
            </g>
            <circle className="dot" cx="50" cy="50" r="2.4" />
          </g>
        </svg>
        <span className="lbl" aria-hidden="true">
          <span>{chant ? t(`chants.${chant}.n`) : t("rose.archives")}</span>
          <b>{title}</b>
        </span>
      </button>

      <div
        ref={panel}
        id="index"
        className="index gut"
        role="dialog"
        aria-modal="true"
        aria-label={t("index.label")}
        data-open={open || undefined}
        data-lenis-prevent
      >
        <div className="index-head">
          <span className="kicker">{t("index.label")}</span>
          <button
            type="button"
            className="close"
            onClick={() => setOpen(false)}
          >
            {t("index.close")}
          </button>
        </div>
        <nav aria-label={t("index.label")}>
          <ol>
            {CHANTS.map((id, i) => (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  aria-current={i === current}
                  onClick={() => {
                    returnFocus.current = false;
                    setOpen(false);
                  }}
                >
                  <span className="n">{t(`chants.${id}.n`)}</span>
                  <span className="t">{t(`chants.${id}.title`)}</span>
                  <span className="s">{t("folio", { n: i + 1 })}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="index-foot">
          <ThemeToggle />
          <CharonToggle />
          <LocaleSwitch />
        </div>
      </div>
    </>
  );
}
