import type { Emblem } from "@/lib/data/types";

// Project emblems (DESIGN §5): the labyrinth, the hydra, the herald, the
// boat. Drawn in a 160×100 box, every stroke with pathLength="1" for the trace.

type Stroke = { d: string; fine?: true };

export const EMBLEMS: Record<Emblem, Stroke[]> = {
  maze: [
    {
      d: "M14 8 H146 V92 H14 V20 H134 V80 H26 V32 H122 V68 H38 V44 H110 V56 H52",
    },
  ],
  hydra: [
    { d: "M44 94 C44 74 68 68 80 68 C92 68 116 74 116 94" },
    { d: "M80 68 C70 52 52 46 38 32" },
    { d: "M80 68 C76 46 70 32 64 14" },
    { d: "M80 68 C84 46 90 32 96 12" },
    { d: "M80 68 C92 52 110 46 124 32" },
  ],
  herald: [
    { d: "M18 58 L108 46 M18 64 L108 54" },
    { d: "M108 46 C120 40 130 36 138 30 L138 70 C130 64 120 60 108 54" },
    {
      d: "M146 38 C152 46 152 54 146 62 M152 30 C162 42 162 58 152 70",
      fine: true,
    },
  ],
  boat: [
    { d: "M24 62 C50 80 112 80 138 60" },
    { d: "M24 62 C14 54 16 40 26 40 C32 40 32 48 28 50" },
    { d: "M80 64 V12" },
    { d: "M56 22 L60 58 Q80 62 100 58 L104 22 Z" },
    {
      d: "M0 88 c6 -6 12 -6 18 0 s12 6 18 0 s12 -6 18 0 s12 6 18 0 s12 -6 18 0 s12 6 18 0 s12 -6 18 0 s12 6 18 0 s12 -6 18 0",
      fine: true,
    },
  ],
};

const RESERVE = Object.keys(EMBLEMS) as Emblem[];

/**
 * Emblem of each project: its own field, otherwise the next one of the
 * reserve in order, never the same twice in a row (DESIGN §5).
 */
export function assignEmblems(chosen: (Emblem | null)[]): Emblem[] {
  const out: Emblem[] = [];
  let next = 0;
  for (const emblem of chosen) {
    let pick = emblem;
    if (!pick) {
      do pick = RESERVE[next++ % RESERVE.length];
      while (pick === out.at(-1));
    }
    out.push(pick);
  }
  return out;
}

/** Decorative. */
export function ProjectEmblem({
  emblem,
  className,
}: {
  emblem: Emblem;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 100"
      className={className ? `line ${className}` : "line"}
      aria-hidden="true"
      focusable="false"
    >
      {EMBLEMS[emblem].map(({ d, fine }, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className={fine ? "fine" : undefined}
        />
      ))}
    </svg>
  );
}
