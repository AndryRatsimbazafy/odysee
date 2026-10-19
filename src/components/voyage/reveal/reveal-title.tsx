"use client";

import {
  Children,
  isValidElement,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { EASE, inView, MOTION_OK, useScrollScene } from "@/lib/motion/gsap";

/** Each word (or rich fragment such as <em>) in its own mask; <br> kept. */
function words(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child, i) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, j) =>
          !part || /^\s+$/.test(part) ? (
            part
          ) : (
            <span className="wd" key={`${i}-${j}`}>
              <span>{part}</span>
            </span>
          ),
        );
    }
    if (isValidElement(child) && child.type === "br") return [child];
    return [
      <span className="wd" key={i}>
        <span>{child}</span>
      </span>,
    ];
  });
}

/**
 * Title revealed word by word (DESIGN §9): each word rises from behind its
 * mask when the title scrolls into view. The text is in the server HTML and
 * stays as is without JS, with reduced motion, or if already on screen.
 */
export function RevealTitle({
  as: Tag = "h2",
  id,
  className,
  children,
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useScrollScene(
    ({ gsap }) => {
      const el = root.current;
      if (!el || inView(el)) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(el.querySelectorAll(".wd > span"), {
          yPercent: 110,
          duration: 0.9,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={className}>
      {words(children)}
    </Tag>
  );
}
