import {
  CONSTELLATION_SCALE,
  CONSTELLATIONS,
  SKY_HEIGHT,
  SKY_WIDTH,
  type ConstellationId,
} from "@/components/engravings/constellations";

// The sky as one markup string, injected once on the client. The star field
// (~820 points) is no DOM at all: each layer is an SVG mask image painted
// with var(--star), so it follows the theme. Only the figures (and their
// names) stay as SVG nodes. Nothing moves inside an SVG (that repaints the
// whole sky every frame): layers are boxes moved by CSS on their own
// compositor layers (T25).

const STAR_COUNT = 820;
const LAYERS = 3;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const VIEWBOX = `0 0 ${SKY_WIDTH} ${SKY_HEIGHT}`;

// Mask images only read alpha: white points, opacity per star.
const HALO_DEF =
  '<defs><radialGradient id="h">' +
  '<stop offset="0" stop-color="#fff" stop-opacity=".9"/>' +
  '<stop offset=".25" stop-color="#fff" stop-opacity=".35"/>' +
  '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
  "</radialGradient></defs>";

/** A box painted in var(--star) through an SVG mask of `body`. */
const masked = (cls: string, body: string) => {
  const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" fill="#fff">${HALO_DEF}${body}</svg>`;
  return `<i class="${cls}" style="--m:url('data:image/svg+xml,${encodeURIComponent(image)}')"></i>`;
};

/** Pseudo-random but stable field (same seed as the prototype). */
function starField(): { still: string; twinkle: string }[] {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const layers = Array.from({ length: LAYERS }, () => ({
    still: "",
    twinkle: "",
  }));
  for (let k = 0; k < STAR_COUNT; k++) {
    const r = rnd();
    const size = r > 0.985 ? 1.5 : r > 0.9 ? 1 : 0.6;
    const x = (rnd() * SKY_WIDTH).toFixed(1);
    const y = (rnd() * SKY_HEIGHT).toFixed(1);
    const opacity = (0.16 + rnd() * 0.42).toFixed(2);
    const layer = layers[k % LAYERS];
    if (r > 0.985) {
      layer.still += `<circle cx="${x}" cy="${y}" r="9" fill="url(#h)" opacity=".2"/>`;
    }
    const star = `<circle cx="${x}" cy="${y}" r="${size}" opacity="${opacity}"/>`;
    // One star in seven twinkles.
    if (k % 7 === 0) layer.twinkle += star;
    else layer.still += star;
  }
  return layers;
}

function figures(names: Record<ConstellationId, string>): string {
  return CONSTELLATIONS.map(({ id, at, stars, edges }, i) => {
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
    return `<g class="cst" style="--i:${i}" transform="translate(${at[0]} ${at[1]}) scale(${CONSTELLATION_SCALE})">${lines}${points}${label}</g>`;
  }).join("");
}

/**
 * .sky-pan (scroll parallax) > .sky-drift (idle drift) >
 * .sky-field (slower parallax) > .fl ×3 (own drift) > still + .tw masks,
 * then the figures SVG, in flow, which gives the sky its height.
 */
export function skyMarkup(names: Record<ConstellationId, string>): string {
  const halo =
    '<defs><radialGradient id="sky-halo">' +
    '<stop offset="0" stop-color="var(--star)" stop-opacity=".9"/>' +
    '<stop offset=".25" stop-color="var(--star)" stop-opacity=".35"/>' +
    '<stop offset="1" stop-color="var(--star)" stop-opacity="0"/>' +
    "</radialGradient></defs>";
  const field = starField()
    .map(
      ({ still, twinkle }) =>
        `<div class="fl">${masked("still", still)}${masked("tw", twinkle)}</div>`,
    )
    .join("");
  return (
    '<div class="sky-pan"><div class="sky-drift">' +
    `<div class="sky-field">${field}</div>` +
    `<svg class="figures" viewBox="${VIEWBOX}" focusable="false">${halo}${figures(names)}</svg>` +
    "</div></div>"
  );
}
