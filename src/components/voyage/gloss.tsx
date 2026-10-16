import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

const QUOTES = { fr: ["«\u00a0", "\u00a0»"], en: ["“", "”"] } as const;

/** One of Charon's notes. Hidden site-wide by the "Charon" header toggle. */
export function Gloss({ children }: { children: ReactNode }) {
  const t = useTranslations("voyage.charon");
  const [open, close] = QUOTES[useLocale()];
  if (!children) return null;

  return (
    <p className="gloss">
      <b>{t("note")}</b>
      {open}
      {children}
      {close}
    </p>
  );
}
