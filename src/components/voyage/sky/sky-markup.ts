import {
  CONSTELLATION_SCALE,
  CONSTELLATIONS,
  SKY_HEIGHT,
  SKY_WIDTH,
  type ConstellationId,
} from "@/components/engravings/constellations";

// The sky as one SVG string, injected once on the client: ~900 decorative
// nodes stay out of the HTML and out of React's reconciliation.

const STAR_COUNT = 820;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/** Pseudo-random but stable field (same seed as the prototype). */
function starField(): string[] {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const layers = ["", "", ""];
  for (let k = 0; k < STAR_COUNT; k++) {
    const r = rnd();
    const size = r > 0.985 ? 1.5 : r > 0.9 ? 1 : 0.6;
    const x = (rnd() * SKY_WIDTH).toFixed(1);
    const y = (rnd() * SKY_HEIGHT).toFixed(1);
    const opacity = (0.16 + rnd() * 0.42).toFixed(2);
    const layer = k % 3;
    if (r > 0.985) {
      layers[layer] +=
        `<circle cx="${x}" cy="${y}" r="9" fill="url(#sky-halo)" opacity=".2"/>`;
    }
    // One star in seven twinkles.
    const twinkle = k % 7 === 0 ? " tw" : "";
    layers[layer] +=
      `<circle class="sf${twinkle}" cx="${x}" cy="${y}" r="${size}" opacity="${opacity}"/>`;
  }
  return layers;
}

function figures(names: Record<ConstellationId, string>): string {
  return CONSTELLATIONS.map(({ id, at, stars, edges }) => {
    const lines = edges
      .map(([a, b]) => {
        const [x1, y1] = stars[a];
        const [x2, y2] = stars[b];
        return `<path class="ed" d="M${x1} ${y1} L${x2} ${y2}"/>`;
      })
      .join("");
    const points = stars
      .map(([x, y], j) => {
        const big = j % 3 === 0;
        return (
          `<circle class="halo" cx="${x}" cy="${y}" r="${big ? 6 : 3.6}" fill="url(#sky-halo)"/>` +
          `<circle class="st" cx="${x}" cy="${y}" r="${big ? 0.7 : 0.45}"/>`
        );
      })
      .join("");
    const xs = stars.map(([x]) => x);
    const ys = stars.map(([, y]) => y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const label = `<text x="${cx}" y="${Math.max(...ys) + 22}" text-anchor="middle">${escape(names[id])}</text>`;
    return `<g class="fl"><g class="cst" transform="translate(${at[0]} ${at[1]}) scale(${CONSTELLATION_SCALE})">${lines}${points}${label}</g></g>`;
  }).join("");
}

export function skyMarkup(names: Record<ConstellationId, string>): string {
  const halo =
    '<defs><radialGradient id="sky-halo">' +
    '<stop offset="0" stop-color="var(--star)" stop-opacity=".9"/>' +
    '<stop offset=".25" stop-color="var(--star)" stop-opacity=".35"/>' +
    '<stop offset="1" stop-color="var(--star)" stop-opacity="0"/>' +
    "</radialGradient></defs>";
  const field = starField()
    .map((layer) => `<g class="fl-s">${layer}</g>`)
    .join("");
  return `<svg viewBox="0 0 ${SKY_WIDTH} ${SKY_HEIGHT}" focusable="false">${halo}<g class="field">${field}</g>${figures(names)}</svg>`;
}
