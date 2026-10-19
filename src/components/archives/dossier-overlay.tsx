"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import {
  EASE,
  inView,
  loadedMotion,
  MOTION_OK,
  useMotion,
} from "@/lib/motion/gsap";
import { lockScroll, scrollToSection } from "@/lib/motion/scroll";

// The dossier as a full-screen dialog over the page (intercepted route,
// DESIGN §8). It only exists after an in-site click, so there is always a
// history entry behind it: closing is `router.back()`, and the browser's own
// back button does the same. Whatever closes it, the slot leaves (unmounted,
// or kept hidden by Next's <Activity>, which also runs effect cleanups) and
// the cleanup below gives the page back.

/** Where to go once the dossier has closed (contact → chant VI). */
let afterClose: (() => void) | null = null;

// Previous / next swaps one dossier instance for another, in no guaranteed
// effect order: the page is frozen while at least one is shown.
let shown = 0;
let behind: HTMLElement[] = [];
let opener: HTMLElement | null = null;

/** The dialog on screen (closing animates it out). */
let active: HTMLElement | null = null;
/** Set by a previous / next click: the next dossier swaps in, unveiled. */
let swapping = false;
let closing = false;

function freezePage() {
  opener =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  behind = Array.from(document.body.children).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      !el.classList.contains("dossier") &&
      !el.inert &&
      el.localName !== "script" &&
      el.localName !== "next-route-announcer",
  );
  behind.forEach((el) => (el.inert = true));
  lockScroll(true);
}

function releasePage(slug: string) {
  behind.forEach((el) => (el.inert = false));
  behind = [];
  lockScroll(false);
  const then = afterClose;
  afterClose = null;
  if (then) return then();
  const link = document.querySelector<HTMLElement>(
    `.pv a[href$="/projects/${slug}"]`,
  );
  (link ?? opener)?.focus({ preventScroll: true });
}

/**
 * Closes the dossier (curtain up, faster than it came down), then optionally
 * jumps to a section of the page.
 */
export function useCloseDossier() {
  const router = useRouter();
  return (sectionId?: string) => {
    if (closing) return;
    closing = true;
    afterClose = sectionId
      ? () => {
          const el = document.getElementById(sectionId);
          if (el) scrollToSection(el);
        }
      : null;
    const done = () => {
      closing = false;
      router.back();
    };
    const gsap = loadedMotion()?.gsap;
    if (!gsap || !active || !matchMedia(MOTION_OK).matches) return done();
    gsap.to(active, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.35,
      ease: EASE,
      onComplete: done,
    });
  };
}

export function DossierOverlay({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const current = useRef(slug);
  const close = useCloseDossier();

  // Opening: the page behind goes inert and frozen; closing gives it back
  // and returns focus to the "Read the archives" link of the last dossier.
  useEffect(() => {
    if (shown++ === 0) freezePage();
    return () => {
      if (--shown === 0) releasePage(current.current);
    };
  }, []);

  // Opening (DESIGN §9): the dossier rises over the page like a curtain
  // coming down (not on previous / next), its opening settles in stagger and
  // its engravings are drawn; sections follow as the dialog scrolls.
  // GSAP is normally here (the archives' scene loaded it); if not, the
  // dossier opens without its entrance rather than blink (`sync`).
  useMotion(
    ({ gsap }, sync) => {
      const dialog = root.current;
      if (!dialog) return;
      active = dialog;
      const first = !swapping;
      swapping = false;
      const q = gsap.utils.selector(dialog);

      gsap.matchMedia().add(MOTION_OK, () => {
        if (sync) {
          if (first) {
            gsap.fromTo(
              dialog,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: EASE,
                clearProps: "clipPath",
              },
            );
          } else {
            gsap.set(dialog, { clearProps: "clipPath" });
          }
          gsap.from(q(".r-open .grid-12 > *"), {
            opacity: 0,
            y: 18,
            duration: 0.8,
            ease: EASE,
            stagger: 0.07,
            delay: first ? 0.3 : 0,
          });
          gsap.fromTo(
            q(".r-open .line [pathLength]"),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: "power2.inOut",
              delay: first ? 0.6 : 0.1,
              autoRound: false,
            },
          );
        }
        for (const block of q(".r-sec, .r-close")) {
          // Late setup: what is already on screen stays as is.
          if (!sync && inView(block)) continue;
          gsap.from(block.querySelectorAll(".grid-12 > *"), {
            opacity: 0,
            y: 16,
            duration: 0.8,
            ease: EASE,
            stagger: 0.08,
            scrollTrigger: {
              trigger: block,
              scroller: dialog,
              start: "top 85%",
              once: true,
            },
          });
        }
      });

      return () => {
        if (active === dialog) active = null;
      };
    },
    { scope: root },
  );

  // Each dossier (first one, then previous / next) starts at its title.
  useEffect(() => {
    current.current = slug;
    const dialog = root.current;
    if (!dialog) return;
    dialog.scrollTop = 0;
    dialog
      .querySelector<HTMLElement>(".d-title")
      ?.focus({ preventScroll: true });
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      ref={root}
      className="dossier"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dossier-${slug}`}
      data-lenis-prevent
      onClickCapture={(e) => {
        // Previous / next: the following dossier swaps in without a curtain.
        if ((e.target as Element).closest("nav a")) swapping = true;
      }}
    >
      {children}
    </div>
  );
}

/** "Back to the archives" inside the dialog. */
export function CloseDossierButton({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const close = useCloseDossier();
  return (
    <button type="button" className={className} onClick={() => close()}>
      {children}
    </button>
  );
}

/** Contact from the dialog: close it, then sail to chant VI. */
export function ContactFromDossierButton({
  children,
}: {
  children: ReactNode;
}) {
  const close = useCloseDossier();
  return (
    <button type="button" className="btn" onClick={() => close("hermes")}>
      {children}
    </button>
  );
}
