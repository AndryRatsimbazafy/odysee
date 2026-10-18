import type { Weapon } from "@/lib/data/types";

// Legendary weapons of the arsenal (DESIGN §5), one per tool, drawn in a
// medallion centred on 0,0 (viewBox -64 -64 128 128). Every stroke has
// pathLength="1" so the trace (stroke-dashoffset 1 → 0) can draw it.

type Stroke = { d: string; fine?: true };

/** Circle as a path, so it traces like any other stroke. */
const ring = (r: number, cx = 0, cy = 0, fine?: true): Stroke => ({
  d: `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`,
  fine,
});

const WEAPONS: Record<Weapon, Stroke[]> = {
  foudre: [
    { d: "M0 -12 C-7 -20 -6 -30 0 -42 C6 -30 7 -20 0 -12" },
    { d: "M0 12 C-7 20 -6 30 0 42 C6 30 7 20 0 12" },
    { d: "M-5 0a5 12 0 1 0 10 0a5 12 0 1 0 -10 0" },
    {
      d: "M-5 -4 L-18 -14 L-12 -18 L-28 -32 M5 -4 L18 -14 L12 -18 L28 -32 M-5 4 L-18 14 L-12 18 L-28 32 M5 4 L18 14 L12 18 L28 32",
      fine: true,
    },
  ],
  egide: [
    ring(32),
    ring(26, 0, 0, true),
    ring(9),
    // Eight snakes around the Gorgon, one every 45°.
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((a): Stroke => {
      const r = (a * Math.PI) / 180;
      const p = (x: number, y: number) =>
        `${(x * Math.cos(r) - y * Math.sin(r)).toFixed(2)} ${(x * Math.sin(r) + y * Math.cos(r)).toFixed(2)}`;
      return {
        d: `M${p(9, 0)} C${p(14, -5)} ${p(18, 4)} ${p(23, 0)}`,
        fine: true,
      };
    }),
  ],
  trident: [
    { d: "M0 -12 V46" },
    { d: "M-20 -42 V-24 Q-20 -12 0 -12 Q20 -12 20 -24 V-42" },
    { d: "M0 -12 V-48" },
    {
      d: "M-20 -42 l-4 7 M-20 -42 l4 7 M20 -42 l-4 7 M20 -42 l4 7 M0 -48 l-4 7 M0 -48 l4 7",
      fine: true,
    },
  ],
  fil: [
    ring(22, -8, -8),
    {
      d: "M-28 -14 Q-8 -26 12 -14 M-30 -4 Q-8 -14 14 -4 M-26 6 Q-8 -2 10 6",
      fine: true,
    },
    { d: "M10 6 C24 16 32 28 20 36 C10 42 24 50 40 44" },
  ],
  caducee: [
    { d: "M0 -36 V46" },
    ring(4, 0, -41),
    {
      d: "M-2 -32 C-14 -44 -30 -40 -36 -28 C-24 -31 -12 -29 -2 -26 M2 -32 C14 -44 30 -40 36 -28 C24 -31 12 -29 2 -26",
    },
    {
      d: "M0 -22 C14 -16 14 -4 0 2 C-14 8 -14 20 0 26 C9 30 9 36 2 38",
      fine: true,
    },
    {
      d: "M0 -22 C-14 -16 -14 -4 0 2 C14 8 14 20 0 26 C-9 30 -9 36 -2 38",
      fine: true,
    },
  ],
  casque: [
    {
      d: "M-24 28 C-30 -10 -22 -34 0 -36 C22 -34 30 -10 24 28 L12 28 L10 2 C8 -4 4 -4 2 2 L2 32 L-2 32 L-2 2 C-4 -4 -8 -4 -10 2 L-12 28 Z",
    },
    { d: "M-20 -30 C-10 -56 10 -56 20 -30", fine: true },
  ],
  harpe: [
    { d: "M2 -6 V44" },
    { d: "M-10 -6 H14" },
    { d: "M0 -6 V-28 C0 -46 20 -48 26 -38 C16 -40 8 -34 8 -24 L6 -6" },
  ],
  arc: [
    { d: "M-12 -42 C28 -22 28 22 -12 42" },
    { d: "M-12 -42 V42", fine: true },
    { d: "M-32 0 H32 M32 0 l-8 -5 M32 0 l-8 5 M-32 0 l5 -4 M-32 0 l5 4" },
  ],
  marteau: [
    { d: "M0 -10 V46" },
    { d: "M-24 -30 H24 V-10 H-24 Z" },
    { d: "M-18 -30 V-10 M18 -30 V-10", fine: true },
  ],
  lyre: [
    { d: "M-18 40 C-30 10 -26 -20 -14 -38 M18 40 C30 10 26 -20 14 -38" },
    { d: "M-14 -38 C-6 -44 6 -44 14 -38" },
    { d: "M-20 30 H20" },
    { d: "M-8 -36 V30 M0 -38 V30 M8 -36 V30", fine: true },
  ],
  bouclier: [
    ring(30),
    ring(20, 0, 0, true),
    { d: "M-30 0 H30 M0 -30 V30", fine: true },
    ring(6),
  ],
  ancre: [
    { d: "M0 -40 V40" },
    ring(5, 0, -44),
    { d: "M-16 -26 H16" },
    { d: "M-30 16 C-26 36 -10 42 0 42 C10 42 26 36 30 16" },
    { d: "M-30 16 l-6 6 M30 16 l6 6", fine: true },
  ],
};

/** Weapons given to tools without one, in this order (DESIGN §5). */
export const WEAPON_RESERVE: Weapon[] = [
  "harpe",
  "arc",
  "marteau",
  "lyre",
  "bouclier",
  "ancre",
];

/**
 * Weapon of each tool: its own field, otherwise the next one of the reserve
 * in order, never the same twice in a row (DESIGN §5).
 */
export function assignWeapons(chosen: (Weapon | null)[]): Weapon[] {
  const out: Weapon[] = [];
  let next = 0;
  for (const weapon of chosen) {
    let pick = weapon;
    if (!pick) {
      do pick = WEAPON_RESERVE[next++ % WEAPON_RESERVE.length];
      while (pick === out.at(-1));
    }
    out.push(pick);
  }
  return out;
}

/** The weapon inside its medallion (double ring + dotted ring). Decorative. */
export function WeaponMedallion({
  weapon,
  className,
}: {
  weapon: Weapon;
  className?: string;
}) {
  return (
    <svg
      viewBox="-64 -64 128 128"
      className={className ? `line ${className}` : "line"}
      aria-hidden="true"
      focusable="false"
    >
      {[ring(62), ring(58, 0, 0, true)].map(({ d, fine }, i) => (
        <path
          key={`r${i}`}
          d={d}
          pathLength={1}
          className={fine ? "fine" : undefined}
        />
      ))}
      <circle r="50" className="fine dots" />
      <g className="weapon">
        {WEAPONS[weapon].map(({ d, fine }, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className={fine ? "fine" : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
