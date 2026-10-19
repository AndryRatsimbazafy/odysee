import type { Locale } from "next-intl";
import type { Profile, Project, SocialLink } from "@/lib/data/types";
import { plain } from "./text";
import { absoluteUrl, siteUrl } from "./urls";

// Structured data (SEO-06), as one @graph per page. Only filled fields are
// emitted: nothing is invented to obtain a rich result. Stable @ids let the
// project pages point at the same Person as the home.

type Node = Record<string, unknown>;

const personId = () => `${siteUrl()}/#person`;
const websiteId = () => `${siteUrl()}/#website`;

/** Drops empty strings, empty arrays and undefined values. */
function compact(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0),
    ),
  );
}

export const graph = (...nodes: Node[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export function websiteNode(locale: Locale, name: string): Node {
  return compact({
    "@type": "WebSite",
    "@id": websiteId(),
    url: absoluteUrl(locale, "/"),
    name,
    inLanguage: locale,
    publisher: { "@id": personId() },
  });
}

export function personNode(
  locale: Locale,
  profile: Profile | null,
  links: SocialLink[],
  fallbackName: string,
): Node {
  return compact({
    "@type": "Person",
    "@id": personId(),
    name: profile?.fullName || fallbackName,
    jobTitle: profile?.title,
    description: profile ? plain(profile.tagline) : undefined,
    url: absoluteUrl(locale, "/"),
    image: profile?.photo?.src,
    homeLocation: profile?.location
      ? { "@type": "Place", name: profile.location }
      : undefined,
    sameAs: links.map((l) => l.url),
  });
}

export function profilePageNode(
  locale: Locale,
  title: string,
  description: string,
  dateModified: string | undefined,
): Node {
  return compact({
    "@type": "ProfilePage",
    "@id": `${absoluteUrl(locale, "/")}#profile`,
    url: absoluteUrl(locale, "/"),
    name: title,
    description,
    inLanguage: locale,
    dateModified,
    isPartOf: { "@id": websiteId() },
    mainEntity: { "@id": personId() },
  });
}

export function breadcrumbNode(
  locale: Locale,
  items: { name: string; href: string }[],
): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };
}

export function creativeWorkNode(
  locale: Locale,
  project: Project,
  description: string,
): Node {
  const url = absoluteUrl(locale, `/projects/${project.slug}`);
  return compact({
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: project.title,
    description,
    inLanguage: locale,
    dateModified: project.updatedAt,
    author: { "@id": personId() },
    creator: { "@id": personId() },
    keywords: project.stack.join(", "),
    image: project.cover?.src ?? project.firstPlate?.src ?? undefined,
    isPartOf: { "@id": websiteId() },
  });
}
