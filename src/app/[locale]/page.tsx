import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Arsenal } from "@/components/chants/arsenal/arsenal";
import { Divinites } from "@/components/chants/divinites/divinites";
import { Epreuves } from "@/components/chants/epreuves/epreuves";
import { Embarcadere } from "@/components/chants/embarcadere/embarcadere";
import { Escales } from "@/components/chants/escales/escales";
import { Hermes } from "@/components/chants/hermes/hermes";
import { Ithaque } from "@/components/chants/ithaque/ithaque";
import { Oracle } from "@/components/chants/oracle/oracle";
import { JsonLd } from "@/components/seo/json-ld";
import { Route } from "@/components/voyage/route/route";
import { getProfile } from "@/lib/data/profile";
import { getSocialLinks } from "@/lib/data/social-links";
import { homeLastModified } from "@/lib/seo/dates";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  graph,
  personNode,
  profilePageNode,
  websiteNode,
} from "@/lib/seo/schema";

/** Title and description: the admin's SEO fields, else the messages. */
async function homeSeo(locale: Locale) {
  const [profile, t] = await Promise.all([
    getProfile(locale),
    getTranslations({ locale, namespace: "metadata" }),
  ]);
  return {
    profile,
    title: profile?.seo.title || t("title"),
    description: profile?.seo.description || t("description"),
    siteName: t("siteName"),
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { title, description } = await homeSeo(locale);
  return pageMetadata({ locale, href: "/", title, description });
}

/** The one-page: the chants in reading order, joined by routes. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const [{ profile, title, description, siteName }, links, modified, hero] =
    await Promise.all([
      homeSeo(locale),
      getSocialLinks(),
      homeLastModified(),
      getTranslations({ locale, namespace: "hero" }),
    ]);

  return (
    <>
      <JsonLd
        data={graph(
          websiteNode(locale, siteName),
          profilePageNode(locale, title, description, modified),
          personNode(locale, profile, links, hero("fallback.name")),
        )}
      />
      <Embarcadere />
      <Route from="embarcadere" to="divinites" />
      <Divinites />
      <Route from="divinites" to="epreuves" />
      <Epreuves />
      <Route from="epreuves" to="arsenal" />
      <Arsenal />
      <Route from="arsenal" to="escales" />
      <Escales />
      <Route from="escales" to="oracle" />
      <Oracle />
      <Route from="oracle" to="hermes" />
      <Hermes />
      <Route from="hermes" to="ithaque" />
      <Ithaque />
    </>
  );
}
