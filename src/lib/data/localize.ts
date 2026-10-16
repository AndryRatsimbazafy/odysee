import type { Locale } from "next-intl";

type Bilingual<K extends string> = { [P in `${K}_fr` | `${K}_en`]: string };

/**
 * Reads a bilingual column pair. An empty English value falls back to French,
 * so content entered only in French still shows on /en.
 */
export function pick<K extends string>(
  row: Bilingual<K>,
  key: K,
  locale: Locale,
): string {
  const fr = row[`${key}_fr`];
  if (locale === "fr") return fr;
  const en = row[`${key}_en`];
  return en.trim() ? en : fr;
}

export const bySortOrder = <T extends { sort_order: number }>(a: T, b: T) =>
  a.sort_order - b.sort_order;
