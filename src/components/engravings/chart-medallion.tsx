import type { CSSProperties } from "react";

// Fig. 1 of the voyage (DESIGN §5): a chart medallion with a ship, the
// graticule and Antananarivo marked. Every stroke has pathLength="1" and an
// index (--i) so the CSS trace can draw them one after the other.

type Stroke = { d: string; fine?: true; soft?: true };

const RINGS: Stroke[] = [
  { d: "M6 150a144 144 0 1 0 288 0a144 144 0 1 0 -288 0" },
  { d: "M12 150a138 138 0 1 0 276 0a138 138 0 1 0 -276 0", fine: true },
  {
    d: "M12 90 H288 M8 150 H292 M12 210 H288 M90 12 V288 M150 8 V292 M210 12 V288",
    fine: true,
    soft: true,
  },
];

const SHIP: Stroke[] = [
  { d: "M78 170 C104 190 196 190 222 168" },
  { d: "M82 167 C112 181 190 181 218 165" },
  { d: "M78 170 C66 160 68 144 80 143 C88 143 88 152 82 153" },
  { d: "M222 168 L238 172 L224 162" },
  { d: "M150 166 V82" },
  { d: "M112 92 Q150 86 188 92" },
  { d: "M114 94 L118 152 Q150 158 182 152 L186 94" },
  { d: "M131 92 V155 M150 90 V157 M169 92 V155", fine: true },
  { d: "M150 82 L86 146 M150 82 L216 160", fine: true },
  {
    d: "M100 176 L92 196 M118 180 L112 200 M136 182 L132 202 M164 182 L164 202 M182 180 L184 200 M200 176 L204 196",
    fine: true,
  },
];

const SEA: Stroke = {
  d: "M40 214 c8 -7 16 -7 24 0 s16 7 24 0 s16 -7 24 0 s16 7 24 0 s16 -7 24 0 s16 7 24 0 s16 -7 24 0 s16 7 24 0 s16 -7 24 0",
  fine: true,
};

export type ChartLabels = {
  city: string;
  coords: string;
  meridian: string;
  lat: [string, string];
};

function paths(strokes: Stroke[], from: number) {
  return strokes.map(({ d, fine, soft }, k) => (
    <path
      key={k}
      d={d}
      pathLength={1}
      className={
        [fine && "fine", soft && "soft"].filter(Boolean).join(" ") || undefined
      }
      style={{ "--i": from + k } as CSSProperties}
    />
  ));
}

/** Decorative: the figure around it carries the accessible label. */
export function ChartMedallion({ labels }: { labels: ChartLabels }) {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <g className="line trace">
        {paths(RINGS, 0)}
        <g className="ship" transform="translate(0 6)">
          {paths(SHIP, RINGS.length)}
        </g>
        {paths([SEA], RINGS.length + SHIP.length)}
      </g>
      <g className="city-mark">
        <circle cx="210" cy="232" r="9" className="line fine" />
        <circle cx="210" cy="232" r="3.2" className="pin" />
        <text x="196" y="229" className="city" textAnchor="end">
          {labels.city}
        </text>
        <text x="196" y="241" textAnchor="end">
          {labels.coords}
        </text>
        <text x="154" y="18">
          {labels.meridian}
        </text>
        <text x="94" y="86">
          {labels.lat[0]}
        </text>
        <text x="94" y="206">
          {labels.lat[1]}
        </text>
      </g>
    </svg>
  );
}
