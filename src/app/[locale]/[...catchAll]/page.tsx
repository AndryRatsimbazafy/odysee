import { notFound } from "next/navigation";

// Any unknown path under a locale renders that locale's 404 (not-found.tsx),
// with the site's header, sky and colophon. It always ends in notFound(), so
// there is nothing for instant-navigation validation to check.
export const instant = false;

export default function UnknownPath() {
  notFound();
}
