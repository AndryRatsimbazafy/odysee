"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fixed header shell: transparent over the hero, opaque (night + rule) once the
 * hero (`[data-hero]`) has scrolled past it. Pages without a hero switch after
 * a short scroll, as in the prototype.
 */
export function HeaderBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.querySelector("[data-hero]");
      const height = ref.current?.offsetHeight ?? 0;
      setSolid(
        hero
          ? hero.getBoundingClientRect().bottom <= height
          : window.scrollY > 40,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header ref={ref} className="top gut" data-solid={solid || undefined}>
      {children}
    </header>
  );
}
