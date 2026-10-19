import { COMPASS_STROKES } from "@/components/engravings/compass-rose";
import { getProfile } from "@/lib/data/profile";
import {
  isOgReadable,
  ogAlt,
  ogMessages,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogPlate,
  ogUploaded,
} from "@/lib/seo/og";
import { plain } from "@/lib/seo/text";
import { siteUrl } from "@/lib/seo/urls";

// Share image of the home, per language (SEO-07).

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Unlike Image, generateImageMetadata receives plain params (not a promise).
export async function generateImageMetadata({
  params,
}: {
  params?: { locale?: string };
}) {
  const alt = await ogAlt(params?.locale);
  return [{ id: "home", alt, size, contentType }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t, hero } = ogMessages((await params).locale);
  const profile = await getProfile(locale);

  if (isOgReadable(profile?.seo.ogImage ?? null)) {
    return ogUploaded(profile!.seo.ogImage!);
  }

  const title = profile?.title || hero("fallback.title");
  return ogPlate({
    kicker: `${t("og.kickerHome")} · ${title}`,
    title: profile?.fullName || hero("fallback.name"),
    subtitle: plain(profile?.tagline || hero.raw("fallback.tagline")),
    footer: new URL(siteUrl()).host,
    engraving: { viewBox: "-64 -64 128 128", strokes: COMPASS_STROKES },
  });
}
