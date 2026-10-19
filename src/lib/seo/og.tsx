import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createTranslator, hasLocale } from "next-intl";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";

// Shared look of the Open Graph images (SEO-07): a plate of the night chart —
// flat night, a gold hairline frame, mono kicker, Cormorant title, gold line
// engraving on the right. Satori has no CSS variables: DESIGN §2 hex values.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const C = {
  nuit: "#101723",
  filet: "#2B3647",
  ivoire: "#EAE2D2",
  ardoise: "#949FB0",
  or: "#B79A65",
  orClair: "#D2B985",
} as const;

type Stroke = { d: string; fine?: true };

export type OgEngraving = { viewBox: string; strokes: Stroke[] };

export type OgPlateProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  footer: string;
  engraving: OgEngraving;
};

// Route Handlers under Cache Components: every IO must be cached, or the image
// cannot be generated for a dossier that was not prerendered.
async function fontFiles() {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "src/lib/seo/fonts");
  const read = async (file: string) =>
    new Uint8Array(await readFile(join(dir, file)));
  return Promise.all([
    read("cormorant-garamond-latin-500-normal.woff"),
    read("cormorant-garamond-latin-500-italic.woff"),
    read("jetbrains-mono-latin-400-normal.woff"),
  ]);
}

/** A copy of the bytes (a cached view may sit in a larger buffer). */
const own = (view: Uint8Array) => Buffer.from(view);

async function fonts() {
  const [display, italic, mono] = (await fontFiles()).map(own);
  return [
    { name: "Cormorant", data: display, weight: 500, style: "normal" },
    { name: "Cormorant", data: italic, weight: 500, style: "italic" },
    { name: "Mono", data: mono, weight: 400, style: "normal" },
  ] as const;
}

/** An uploaded image as a data URL (cached: Satori would fetch it uncached). */
async function imageData(src: string) {
  "use cache";
  cacheLife("max");
  const res = await fetch(src);
  if (!res.ok) throw new Error(`og image ${src}: ${res.status}`);
  const type = res.headers.get("content-type") ?? "image/png";
  const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
  return `data:${type};base64,${base64}`;
}

const ENGRAVING_PX = 260;

/** Drawn px per viewBox unit, so every engraving gets the same line. */
const scale = ({ viewBox }: OgEngraving) => {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return ENGRAVING_PX / Math.max(w, h);
};

/** Title size from its length, so long titles stay within three lines. */
const titleSize = (title: string) =>
  title.length <= 22 ? 104 : title.length <= 44 ? 80 : 62;

/** Satori reads JPEG and PNG, not WebP or AVIF. */
export const isOgReadable = (src: string | null): src is string =>
  !!src && /\.(jpe?g|png)$/i.test(new URL(src).pathname);

const MESSAGES = { fr, en } as const;

/**
 * Messages of a share image. Image routes are Route Handlers, where next-intl
 * cannot read the locale (next/root-params), and generateImageMetadata may
 * run without the parent params: read the messages directly.
 */
export function ogMessages(requested: string | undefined) {
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messages = MESSAGES[locale];
  return {
    locale,
    t: createTranslator({ locale, messages, namespace: "metadata" }),
    hero: createTranslator({ locale, messages, namespace: "hero" }),
  };
}

/** Alt text of a share image: the page title. */
export async function ogAlt(requested: string | undefined, title?: string) {
  const { t } = ogMessages(requested);
  return title ? t("template", { title }) : t("title");
}

/** The generated plate. */
export async function ogPlate({
  kicker,
  title,
  subtitle,
  footer,
  engraving,
}: OgPlateProps) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 36,
          background: C.nuit,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            border: `1px solid ${C.or}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              padding: "56px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                fontFamily: "Mono",
                fontSize: 20,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.ardoise,
              }}
            >
              <div style={{ width: 48, height: 1, background: C.or }} />
              {kicker}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  fontFamily: "Cormorant",
                  fontSize: titleSize(title),
                  lineHeight: 0.98,
                  color: C.ivoire,
                  lineClamp: 3,
                }}
              >
                {title}
              </div>
              {subtitle ? (
                <div
                  style={{
                    fontFamily: "Cormorant",
                    fontStyle: "italic",
                    fontSize: 36,
                    lineHeight: 1.2,
                    color: C.orClair,
                    lineClamp: 2,
                  }}
                >
                  {subtitle}
                </div>
              ) : null}
            </div>
            <div
              style={{
                fontFamily: "Mono",
                fontSize: 18,
                letterSpacing: 2,
                color: C.ardoise,
              }}
            >
              {footer}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 360,
              borderLeft: `1px solid ${C.filet}`,
            }}
          >
            <svg
              viewBox={engraving.viewBox}
              width={ENGRAVING_PX}
              height={ENGRAVING_PX}
              fill="none"
              stroke={C.or}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {engraving.strokes.map(({ d, fine }, i) => (
                <path
                  key={i}
                  d={d}
                  strokeWidth={(fine ? 0.8 : 1.6) / scale(engraving)}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [...(await fonts())] },
  );
}

/** An image uploaded in the admin replaces the generated plate. */
export async function ogUploaded(src: string) {
  const data = await imageData(src);
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element -- Satori, not the DOM.
      <img
        src={data}
        alt=""
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{ objectFit: "cover" }}
      />
    ),
    OG_SIZE,
  );
}
