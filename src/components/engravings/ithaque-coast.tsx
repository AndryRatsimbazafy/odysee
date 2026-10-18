// The coast of Ithaca and the boat coming home (DESIGN §5, epilogue), in a
// 1200×120 strip. Every stroke has pathLength="1" for the trace.

type Stroke = { d: string; className?: string };

const COAST: Stroke[] = [
  { d: "M0 104 H1200", className: "fine soft" },
  {
    d: "M760 104 C800 98 820 70 860 64 C890 60 900 40 940 36 C980 32 1000 58 1040 60 C1080 62 1110 80 1150 88 C1170 92 1190 100 1200 104",
  },
  {
    d: "M820 104 C860 96 900 84 960 82 C1010 80 1060 92 1100 104",
    className: "fine",
  },
  // The boat, sailing towards the shore.
  { d: "M300 100 C320 110 372 110 392 98" },
  { d: "M346 100 V58" },
  { d: "M326 62 L330 92 Q346 95 362 92 L366 62 Z" },
  {
    d: "M120 112 c8 -5 16 -5 24 0 s16 5 24 0 s16 -5 24 0 s16 5 24 0 s16 -5 24 0 s16 5 24 0 s16 -5 24 0 s16 5 24 0",
    className: "fine",
  },
];

/** Decorative. */
export function IthaqueCoast({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMax meet"
      className={className ? `line ${className}` : "line"}
      aria-hidden="true"
      focusable="false"
    >
      {COAST.map(({ d, className: c }, i) => (
        <path key={i} d={d} pathLength={1} className={c} />
      ))}
    </svg>
  );
}
