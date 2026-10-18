// Emblems of chant I (DESIGN §5): Hephaestus' hammer on the anvil, Athena's
// olive branch, each inside a double ring. Every stroke has pathLength="1"
// so the trace (stroke-dashoffset 1 → 0) can draw it.

type Stroke = { d: string; fine?: true };

const RINGS: Stroke[] = [
  { d: "M3 60a57 57 0 1 0 114 0a57 57 0 1 0 -114 0" },
  { d: "M7 60a53 53 0 1 0 106 0a53 53 0 1 0 -106 0", fine: true },
];

const HAMMER: Stroke[] = [
  { d: "M34 90 L76 48" },
  { d: "M70 32 L92 54 L84 62 L62 40 Z" },
  { d: "M66 36 L88 58", fine: true },
  { d: "M28 96 H92" },
  { d: "M34 100 H86", fine: true },
  { d: "M24 84 L18 80 M26 78 L22 70 M32 76 L32 68", fine: true },
];

const OLIVE: Stroke[] = [
  { d: "M30 94 C46 78 66 56 90 26" },
  { d: "M40 82 C34 74 28 72 22 72 C28 78 34 82 40 82 Z" },
  { d: "M46 76 C48 66 46 60 42 56 C42 64 42 70 46 76 Z" },
  { d: "M56 64 C50 58 44 56 38 58 C44 62 50 64 56 64 Z" },
  { d: "M62 58 C66 50 66 44 62 38 C60 46 60 52 62 58 Z" },
  { d: "M72 46 C66 40 60 40 54 42 C60 46 66 46 72 46 Z" },
  { d: "M78 40 C84 34 86 28 84 22 C80 28 78 34 78 40 Z" },
  { d: "M54 74 a3 3.8 -30 1 0 0.1 0", fine: true },
  { d: "M70 60 a3 3.8 -30 1 0 0.1 0", fine: true },
];

function Medallion({ strokes }: { strokes: Stroke[] }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="emb line"
      aria-hidden="true"
      focusable="false"
    >
      {[...RINGS, ...strokes].map(({ d, fine }, i) => (
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

/** Hephaestus, the craft. Decorative. */
export const HammerEngraving = () => <Medallion strokes={HAMMER} />;

/** Athena, the counsel. Decorative. */
export const OliveEngraving = () => <Medallion strokes={OLIVE} />;
