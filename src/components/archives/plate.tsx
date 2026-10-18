import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProjectEmblem } from "@/components/engravings/project-emblems";
import type { Emblem, Plate } from "@/lib/data/types";

type PlateView = Pick<Plate, "src" | "kind" | "alt" | "ratio">;

/**
 * A plate at its own ratio, or its empty slot (DESIGN §8): frame, project
 * emblem as a watermark and the `[à fournir]` label.
 */
export function PlateImage({
  plate,
  n,
  emblem,
  sizes,
  priority,
  labelled = true,
}: {
  plate: PlateView | null;
  /** 1-based figure number. */
  n: number;
  emblem: Emblem;
  sizes: string;
  priority?: boolean;
  /** False when a parent control already names the plate (zoom button). */
  labelled?: boolean;
}) {
  const t = useTranslations("dossier.plate");
  const tv = useTranslations("voyage");
  const kind = plate?.kind || tv("todo");
  const ratio = plate?.ratio ?? "16/10";

  if (plate?.src) {
    return (
      <div className="ph-img" style={{ aspectRatio: ratio }}>
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }
  return (
    <div
      className="ph-img empty"
      style={{ aspectRatio: ratio }}
      {...(labelled
        ? { role: "img", "aria-label": t("emptyLabel", { kind }) }
        : { "aria-hidden": true })}
    >
      <ProjectEmblem emblem={emblem} className="wm" />
      <div className="lab" aria-hidden="true">
        <span>{t("empty", { n, kind })}</span>
        <small>{t("format", { ratio: ratio.replace("/", ":") })}</small>
      </div>
    </div>
  );
}

/** A captioned, zoomable plate of the dossier: « Fig. n · nature — légende ». */
export function PlateFigure({
  plate,
  n,
  emblem,
  sizes,
  priority,
  className,
}: {
  plate: Plate;
  n: number;
  emblem: Emblem;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const t = useTranslations("dossier.plate");
  const tv = useTranslations("voyage");

  return (
    <figure className={className}>
      {/* Opens the lightbox (delegated click, see PlateViewer). */}
      <button
        type="button"
        className="zoom"
        data-plate={n - 1}
        aria-label={t("zoom", { n, kind: plate.kind || tv("todo") })}
      >
        <PlateImage
          plate={plate}
          n={n}
          emblem={emblem}
          sizes={sizes}
          priority={priority}
          labelled={false}
        />
      </button>
      <figcaption>
        <b>{t("fig", { n })}</b>
        <span>
          {plate.kind || tv("todo")} — {plate.caption || tv("todo")}
        </span>
      </figcaption>
    </figure>
  );
}
