// Geometry of the crossing chart (STORYBOARD §3), computed from the number of
// projects alone: no point coordinate is written by hand (DESIGN §10).
// Units are viewBox units; the SVG scales to its column.

export const CHART_WIDTH = 400;
const PAD = 40; // side margin, room for the port and the outer labels
const TOP = 40; // above the last point (north arrow)
const BOTTOM = 56; // below the port (its label)
const GRID = 60; // graticule spacing
const PHI = (1 + Math.sqrt(5)) / 2;

export type ChartPoint = {
  x: number;
  y: number;
  /** Label side: after the point (left half) or before it (right half). */
  labelEnd: boolean;
};

export type ChartLayout = {
  width: number;
  height: number;
  port: { x: number; y: number };
  points: ChartPoint[];
  /** One quadratic leg per point, from the previous stop. */
  legs: string[];
  /** All legs as one path (the boat sails it). */
  route: string;
  graticule: string;
};

const r1 = (v: number) => Math.round(v * 10) / 10;
const frac = (v: number) => v - Math.floor(v);

export function chartLayout(n: number): ChartLayout {
  // The chart grows with n, but the vertical step stays readable.
  const step = Math.min(92, Math.max(48, 380 / Math.max(n, 1)));
  const height = r1(TOP + BOTTOM + n * step);
  const port = { x: PAD, y: r1(height - BOTTOM) };
  const half = CHART_WIDTH / 2;

  // Coasting zigzag: sides alternate, and the distance from the axis follows
  // the golden-ratio sequence, so no two stops share a place, every time.
  const points = Array.from({ length: n }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const reach = 0.35 + 0.5 * frac((i + 1) * PHI);
    const x = r1(half + side * reach * (half - PAD));
    return { x, y: r1(port.y - (i + 1) * step), labelEnd: x > half };
  });

  // Each leg bows to alternate sides of its chord.
  let prev = port;
  const legs = points.map((p, i) => {
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const bow = 0.18 * len * (i % 2 ? 1 : -1);
    const cx = r1((prev.x + p.x) / 2 + (-dy / len) * bow);
    const cy = r1((prev.y + p.y) / 2 + (dx / len) * bow);
    const d = `M${prev.x} ${prev.y} Q${cx} ${cy} ${p.x} ${p.y}`;
    prev = p;
    return d;
  });
  const route = legs
    .map((d, i) => (i ? d.replace(/^M[^Q]+/, "") : d))
    .join(" ");

  let graticule = "";
  for (let x = PAD; x <= CHART_WIDTH; x += GRID) {
    graticule += `M${x} ${TOP / 2} V${r1(height - TOP / 2)} `;
  }
  for (let y = TOP / 2 + 10; y <= height - TOP / 2; y += GRID) {
    graticule += `M0 ${y} H${CHART_WIDTH} `;
  }

  return {
    width: CHART_WIDTH,
    height,
    port,
    points,
    legs,
    route,
    graticule: graticule.trim(),
  };
}
