"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
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

/** Closes the dossier, then optionally jumps to a section of the page. */
export function useCloseDossier() {
  const router = useRouter();
  return (sectionId?: string) => {
    afterClose = sectionId
      ? () => {
          const el = document.getElementById(sectionId);
          if (el) scrollToSection(el);
        }
      : null;
    router.back();
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
