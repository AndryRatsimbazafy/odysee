import type { CSSProperties } from "react";

// Fig. 1 of the voyage (DESIGN §5): a chart medallion with the navigator's
// bust (curly crop, round glasses, mandarin collar, jacket and the chain of
// office), the graticule and Antananarivo marked. Every stroke has
// pathLength="1" and an index (--i) so the CSS trace can draw them one after
// the other.

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

/** Head and neck, shared with the header mark (portrait-mark.tsx). */
export const HEAD: Stroke[] = [
  // Curly crown over a short fade.
  {
    d: "M111.1 107.5 A4.1 4.1 0 0 1 109.7 100.8 A4.1 4.1 0 0 1 107.5 94 A4.1 4.1 0 0 1 110 87.3 A4.2 4.2 0 0 1 110.4 80.3 A4.7 4.7 0 0 1 114 74.2 A4.1 4.1 0 0 1 118.9 69.2 A4.5 4.5 0 0 1 123 63.3 A4.7 4.7 0 0 1 129.7 60.6 A4.4 4.4 0 0 1 135.7 56.6 A4.6 4.6 0 0 1 142.9 56 A4 4 0 0 1 150 55.3 A4.1 4.1 0 0 1 157.3 54.8 A4.4 4.4 0 0 1 164.7 55.4 A4.9 4.9 0 0 1 170.4 60.4 A4.3 4.3 0 0 1 176.4 64 A4.3 4.3 0 0 1 182.5 68 A4.7 4.7 0 0 1 187.6 73.3 A4.5 4.5 0 0 1 189.7 80.2 A4.2 4.2 0 0 1 191 87.1 A4.9 4.9 0 0 1 193.5 94 A5 5 0 0 1 189.9 100.7 A4.3 4.3 0 0 1 190.5 108.1",
  },
  { d: "M114 99 Q130 89 150 91 Q170 89 186 99" },
  // Face, ears.
  { d: "M114 104 C114 136 124 166 150 173 C176 166 186 136 186 104" },
  {
    d: "M114 112 C106 108 104 124 108 132 C110 137 114 138 115 134 M186 112 C194 108 196 124 192 132 C190 137 186 138 185 134",
  },
  // Round glasses.
  {
    d: "M121 118 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M153 118 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M147 116 Q150 112.5 153 116 M121 116 L114 113 M179 116 L186 113",
  },
  // Neck.
  { d: "M138 166 V188 M162 166 V188" },
];

const FACE: Stroke[] = [
  // Curl texture, the fade at the temples.
  {
    d: "M154.9 80.4 A2.6 2.6 0 1 1 158.1 78.9 M176 85.1 A2.6 2.6 0 1 1 180.3 87.6 M122.8 72 A2.6 2.6 0 1 1 119 72.2 M151.8 57.9 A3 3 0 1 1 146.2 59.1 M164.3 88.7 A2.3 2.3 0 1 1 163.9 85.1 M134 86.4 A2.7 2.7 0 1 1 138.2 85.8 M131.7 71.1 A2.4 2.4 0 1 1 133.5 75.1 M146.5 76.6 A2.3 2.3 0 1 1 144.5 80.6 M143.8 68.6 A3 3 0 1 1 141 73.2 M165.2 80.1 A2.7 2.7 0 1 1 165.2 75 M170.6 75 A2.9 2.9 0 1 1 175.4 73.8 M142.1 64.5 A2.6 2.6 0 1 1 143.9 59.9 M157.5 61.6 A3 3 0 1 1 163.1 60.8 M123.1 92.8 A3.1 3.1 0 1 1 121.5 87.2 M184.2 89.9 A2.4 2.4 0 1 1 185.8 93.1 M166.9 66.9 A2.2 2.2 0 1 1 163.5 66.2 M126.3 90.3 A3 3 0 1 1 131.7 90.2 M151.2 73.8 A2.3 2.3 0 1 1 153.6 71.7 M131.3 64 A2.5 2.5 0 1 1 127.7 63.5 M129.5 84.1 A3.1 3.1 0 1 1 128.3 78.7 M180.6 79.9 A3 3 0 1 1 184.4 75.6 M114.2 83.7 A2.2 2.2 0 1 1 116.9 86.3 M152.1 88.9 A2.4 2.4 0 1 1 154.5 85.9 M142.5 86 A2.4 2.4 0 1 1 139.6 87.8 M173.6 83.8 A2.6 2.6 0 1 1 172.8 79.4 M172.3 90.6 A2.5 2.5 0 1 1 171.3 86.8 M112.8 93.9 A2.8 2.8 0 1 1 115.2 89.3 M161.1 69.8 A2.9 2.9 0 1 1 155.8 70.4",
    fine: true,
  },
  {
    d: "M112 101 v7 M115 100 v8 M185 100 v8 M188 101 v7",
    fine: true,
    soft: true,
  },
  // Brows, eyes behind the lenses.
  { d: "M123 104 Q132 99.5 142 103 M158 103 Q168 99.5 177 104" },
  {
    d: "M127 119 Q134 113.5 141 119 M159 119 Q166 113.5 173 119 M131.6 118.6 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0 M163.6 118.6 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0",
  },
  {
    d: "M128 120.5 Q134 123 140 120.5 M160 120.5 Q166 123 172 120.5",
    fine: true,
  },
  // Nose, lips, the goatee.
  {
    d: "M146.5 121 C145.5 128 144.5 133 143.5 136.5 M142.5 137.5 Q144 141 147 140 Q150 141.5 153 140 Q156 141 157.5 137.5",
  },
  { d: "M141 155 Q145 153.5 150 154.5 Q155 153.5 159 155" },
  {
    d: "M144 159 Q150 161.5 156 159 M146 165.5 Q150 168 154 165.5",
    fine: true,
  },
  // Shadow side of the face, under the chin.
  {
    d: "M177 141 l3 -5 M174 149 l3.5 -5.5 M170 157 l3.5 -5.5 M164.5 164 l3 -4.5 M146 178 l3 3 M152 178 l3 3",
    fine: true,
    soft: true,
  },
];

// Mandarin collar, jacket and its notched lapels, pocket square, lapel pin.
const BODY: Stroke[] = [
  {
    d: "M134 186 Q150 193 166 186 M134 186 L135 195 Q150 202 165 195 L166 186",
  },
  {
    d: "M134 194 C118 200 96 204 76 214 C58 222 50 240 46 296 M166 194 C182 200 204 204 224 214 C242 222 250 240 254 296",
  },
  {
    d: "M136 198 C126 206 116 214 112 222 L120 226 L110 236 C122 260 136 282 148 300 M164 198 C174 206 184 214 188 222 L180 226 L190 236 C178 260 164 282 152 300",
    fine: true,
  },
  { d: "M150 200 V250 M150 212 v0.5 M150 228 v0.5 M150 244 v0.5", fine: true },
  {
    d: "M196 262 L226 257 M200 262 L206 253 L213 259 L219 253 L224 258",
    fine: true,
  },
  { d: "M194 216 L201 215 L202 222 L195 223 Z", fine: true },
  {
    d: "M72 230 C64 248 60 268 58 292 M84 224 C76 244 72 266 70 292 M228 230 C236 248 240 268 242 292 M216 224 C224 244 228 266 230 292",
    fine: true,
    soft: true,
  },
];

// The chain of office: a ribbon down each side to the badge, plaques on it.
const CHAIN: Stroke[] = [
  {
    d: "M119 199 L143 280 M130 197 L151 268 M181 199 L157 280 M170 197 L149 268",
    fine: true,
  },
  { d: "M150 286 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" },
];

/** Plaques on the ribbons, also gilded by the glint (globals.css). */
const PLAQUES = [
  "M118.6 199.8 L132.4 202 L131.4 208.2 L117.6 206 Z",
  "M181.4 199.8 L167.6 202 L168.6 208.2 L182.4 206 Z",
  "M122.7 213.1 L136.5 215.3 L135.5 221.4 L121.7 219.2 Z",
  "M177.3 213.1 L163.5 215.3 L164.5 221.4 L178.3 219.2 Z",
  "M126.8 226.4 L140.6 228.6 L139.6 234.7 L125.8 232.5 Z",
  "M173.2 226.4 L159.4 228.6 L160.4 234.7 L174.2 232.5 Z",
  "M130.9 239.6 L144.7 241.8 L143.7 247.9 L129.9 245.7 Z",
  "M169.1 239.6 L155.3 241.8 L156.3 247.9 L170.1 245.7 Z",
  "M135 252.9 L148.8 255.1 L147.8 261.2 L134 259 Z",
  "M165 252.9 L151.2 255.1 L152.2 261.2 L166 259 Z",
];

// Silhouette that hides the graticule behind the bust and under the city
// labels (mask, black = hidden).
const KNOCKOUT =
  "M110 108 a40 52 0 0 1 80 0 C190 140 180 164 166 174 L166 192 C204 202 246 212 256 300 L44 300 C54 212 96 202 134 192 L134 174 C120 164 110 140 110 108 Z M26 162 h108 v26 h-108 Z";

// The head is drawn at a larger scale and set on the shoulders (around the
// collar, 150 176) at a classical proportion.
const HEAD_ON_SHOULDERS = "matrix(0.88 0 0 0.88 18 21.12)";

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
      <defs>
        <mask id="fig1-knockout" maskUnits="userSpaceOnUse">
          <rect width="300" height="300" fill="#fff" />
          <path d={KNOCKOUT} fill="#000" />
        </mask>
        <clipPath id="fig1-frame">
          <circle cx="150" cy="150" r="137" />
        </clipPath>
      </defs>
      <g className="line trace">
        {paths(RINGS.slice(0, 2), 0)}
        <g mask="url(#fig1-knockout)">{paths(RINGS.slice(2), 2)}</g>
        <g clipPath="url(#fig1-frame)">
          <g className="bust">
            <g transform={HEAD_ON_SHOULDERS}>
              {paths([...HEAD, ...FACE], RINGS.length)}
              <g className="glint">
                <path
                  className="lens"
                  d="M126 112 L131 107 M158 112 L163 107"
                />
              </g>
            </g>
            {paths(
              [...BODY, ...CHAIN, { d: PLAQUES.join(" "), fine: true }],
              RINGS.length + HEAD.length + FACE.length,
            )}
            <g className="glint">
              {PLAQUES.map((d, k) => (
                <path
                  key={k}
                  d={d}
                  style={{ "--g": k >> 1 } as CSSProperties}
                />
              ))}
            </g>
          </g>
        </g>
      </g>
      <g className="city-mark">
        <circle cx="44" cy="150" r="9" className="line fine" />
        <circle cx="44" cy="150" r="3.2" className="pin" />
        <text x="30" y="172" className="city">
          {labels.city}
        </text>
        <text x="30" y="184">
          {labels.coords}
        </text>
        <text x="154" y="18">
          {labels.meridian}
        </text>
        <text x="28" y="86">
          {labels.lat[0]}
        </text>
        <text x="24" y="206">
          {labels.lat[1]}
        </text>
      </g>
    </svg>
  );
}
