import { useTranslations } from "next-intl";
import { LoaderBar } from "./loader-bar";

const b = (chunks: React.ReactNode) => <b>{chunks}</b>;

// Sea: a wave pattern repeated wide enough to scroll by 52 px.
const wave = (amp: number) =>
  `c9 -${amp} 17 -${amp} 26 0 s17 ${amp} 26 0 ` +
  Array.from({ length: 7 }, () => `s17 -${amp} 26 0 s17 ${amp} 26 0`).join(" ");

/**
 * "Embarquement · Antananarivo" (DESIGN §6.2): server-rendered, hidden by
 * CSS unless BOARDING_INIT_SCRIPT flagged a first visit before paint.
 * The boat, compass and sea are CSS animations; LoaderBar tracks progress.
 */
export function Loader() {
  const t = useTranslations("voyage.loader");
  return (
    <div className="loader" role="status" aria-label={t("label")}>
      <div className="box">
        <svg viewBox="0 0 340 170" aria-hidden="true">
          <g className="ln sky-ln">
            <circle className="tw" cx="40" cy="26" r="1.2" />
            <circle className="tw" cx="96" cy="14" r="1" />
            <circle className="tw" cx="150" cy="30" r="1.4" />
            <circle className="tw" cx="210" cy="12" r="1" />
            <circle className="tw" cx="248" cy="34" r="1.2" />
            <path className="fine faint" d="M40 26 L96 14 L150 30 L210 12" />
          </g>
          <g className="ln">
            <circle
              className="draw d4"
              pathLength={1}
              cx="300"
              cy="40"
              r="22"
            />
            <circle className="fine dots" cx="300" cy="40" r="17" />
            <g className="needle">
              <path className="north" d="M300 22 L304 40 L300 44 L296 40 Z" />
              <path className="fine" d="M300 58 L304 40 L300 36 L296 40 Z" />
            </g>
          </g>
          <g className="bob">
            <g className="ln">
              <path
                className="draw"
                pathLength={1}
                d="M98 128 C122 146 214 146 240 126"
              />
              <path
                className="draw"
                pathLength={1}
                d="M98 128 C86 118 88 102 100 101 C108 101 108 110 102 111"
              />
              <path
                className="draw d2"
                pathLength={1}
                d="M240 126 L256 130 L242 120"
              />
              <path className="draw d2" pathLength={1} d="M170 132 V54" />
              <path
                className="draw d3"
                pathLength={1}
                d="M134 62 Q170 56 206 62 L202 116 Q170 122 138 116 Z"
              />
              <path
                className="draw d3 fine"
                pathLength={1}
                d="M152 60 V118 M170 58 V120 M188 60 V118"
              />
              <path
                className="draw d4 fine"
                pathLength={1}
                d="M170 54 L106 116 M170 54 L238 122"
              />
            </g>
          </g>
          <g className="ln fine">
            <g className="sea">
              <path d={`M0 150 ${wave(7)}`} />
              <path className="far" d={`M-13 162 ${wave(6)}`} />
            </g>
          </g>
        </svg>
        <p className="quote">{t("quote")}</p>
        <LoaderBar />
        <span className="lbl">{t.rich("boarding", { b })}</span>
      </div>
    </div>
  );
}
