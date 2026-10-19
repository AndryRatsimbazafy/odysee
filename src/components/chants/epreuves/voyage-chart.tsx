import { chartLayout } from "./chart-layout";

/** Advance of an 11 px JetBrains Mono glyph (0.6 em), in viewBox units. */
const MONO_ADVANCE = 6.6;
/** The north arrow and its "N": right-hand room it takes, down to this y. */
const NORTH_ROOM = 36;
const NORTH_BOTTOM = 56;

type ChartLabels = { title: string; port: string; north: string };

/**
 * The crossing chart, server-rendered from the number of projects: graticule,
 * home port, one stop per project and the legs between them, the north and
 * the boat (placed and sailed by VoyageStage). Readable without JS.
 */
export function VoyageChart({
  points: stops,
  labels,
}: {
  points: { n: string; label: string }[];
  labels: ChartLabels;
}) {
  const { width, height, port, points, legs, route, graticule } = chartLayout(
    stops.length,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby="carte-t"
      focusable="false"
    >
      <title id="carte-t">{labels.title}</title>
      <path className="grat" d={graticule} />
      {legs.map((d, i) => (
        <path key={i} className="leg" data-leg={i + 1} d={d} />
      ))}
      <g className="port">
        <circle cx={port.x} cy={port.y} r={4} />
        <text x={port.x + 12} y={port.y + 4}>
          {labels.port}
        </text>
      </g>
      {points.map((p, i) => {
        const full = `${stops[i].n} · ${stops[i].label}`;
        const x = p.labelEnd ? p.x - 14 : p.x + 14;
        // A long short title is cut to the room left before the chart's edge,
        // or before the north arrow at its height (the full name stays in the
        // title and in the dossier preview).
        const edge = p.y < NORTH_BOTTOM ? width - NORTH_ROOM : width;
        const room = Math.floor(
          ((p.labelEnd ? x : edge - x) - 6) / MONO_ADVANCE,
        );
        const label =
          full.length > room ? `${full.slice(0, room - 1).trimEnd()}…` : full;
        // Monospace labels: the width is known, so a plate of night is laid
        // under each name and the legs pass beneath it, not through it.
        const w = label.length * MONO_ADVANCE + 6;
        return (
          <g key={i} className="pt" data-jump={i + 1}>
            <rect
              className="plate"
              x={p.labelEnd ? x - w + 3 : x - 3}
              y={p.y - 8}
              width={w}
              height={15}
            />
            <circle cx={p.x} cy={p.y} r={6} />
            <text x={x} y={p.y + 4} textAnchor={p.labelEnd ? "end" : undefined}>
              {label !== full ? <title>{full}</title> : null}
              {label}
            </text>
          </g>
        );
      })}
      <g className="north" transform={`translate(${width - 24} 8)`}>
        <path d="M0 26 V2 M-6 12 L0 0 L6 12" />
        <text x={0} y={40} textAnchor="middle">
          {labels.north}
        </text>
      </g>
      <path className="route" d={route} />
      <g className="boat" transform={`translate(${port.x} ${port.y - 4})`}>
        <path d="M-14 2 Q0 9 14 1 M-14 2 Q-17 -2 -13 -4 M0 3 V-14 M-6 -12 L6 -12 L5 -3 L-5 -3 Z" />
      </g>
    </svg>
  );
}
