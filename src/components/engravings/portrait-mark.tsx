import { HEAD } from "./chart-medallion";

/**
 * The brand mark: the head of Fig. 1 in a cameo, same strokes, kept at a
 * hairline whatever its size. Decorative: the brand link carries the name.
 */
export function PortraitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="76 50 148 148"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="brand-cameo">
          <circle cx="150" cy="124" r="71" />
        </clipPath>
      </defs>
      <g className="line">
        <circle cx="150" cy="124" r="73" vectorEffect="non-scaling-stroke" />
        <g clipPath="url(#brand-cameo)">
          {HEAD.map(({ d }, k) => (
            <path key={k} d={d} vectorEffect="non-scaling-stroke" />
          ))}
          <path
            d="M134 186 Q150 193 166 186 M134 194 C118 200 96 204 76 214 M166 194 C182 200 204 204 224 214"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
    </svg>
  );
}
