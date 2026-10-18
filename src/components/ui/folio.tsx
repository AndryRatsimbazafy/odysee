import { useTranslations } from "next-intl";

/** "Folio n", in italic display type. */
export function Folio({ n }: { n: number }) {
  const t = useTranslations("voyage");
  return <span className="folio">{t("folio", { n })}</span>;
}
