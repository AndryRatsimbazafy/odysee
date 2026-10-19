// A mariner's compass, lost between Charybdis and Scylla (404, STORYBOARD
// §10): rings, sixteen rhumbs, a needle that has lost the north. Centred on
// 0,0 (viewBox -64 -64 128 128); every stroke has pathLength="1".

const ring = (r: number) =>
  `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Point (x, y) at `deg` degrees (0 = north), `r` from the centre. */
const at = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
};

export const COMPASS_STROKES: { d: string; fine?: true }[] = [
  { d: ring(60) },
  { d: ring(54), fine: true },
  { d: ring(14), fine: true },
  // Sixteen rhumb lines; the four cardinal ones longer.
  ...Array.from({ length: 16 }, (_, k) => ({
    d: `M${at(k * 22.5, 54)} L${at(k * 22.5, k % 4 ? 46 : 40)}`,
    fine: true as const,
  })),
  // The star: four long points, four short ones.
  ...[0, 90, 180, 270].map((deg) => ({
    d: `M${at(deg, 38)} L${at(deg + 8, 10)} L0 0 L${at(deg - 8, 10)} Z`,
  })),
  ...[45, 135, 225, 315].map((deg) => ({
    d: `M${at(deg, 24)} L${at(deg + 10, 8)} L0 0 L${at(deg - 10, 8)} Z`,
    fine: true as const,
  })),
];

/** Decorative. The needle (class "needle") points off course. */
export function CompassRoseEngraving({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-64 -64 128 128"
      className={className ? `line ${className}` : "line"}
      aria-hidden="true"
      focusable="false"
    >
      {COMPASS_STROKES.map(({ d, fine }, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className={fine ? "fine" : undefined}
        />
      ))}
      <g className="needle">
        <path d="M0 -50 L4 0 L0 6 L-4 0 Z" pathLength={1} />
      </g>
    </svg>
  );
}
