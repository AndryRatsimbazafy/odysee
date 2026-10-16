import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { LocaleSwitch } from "@/components/ui/locale-switch";

// Temporary i18n check page (T03): unstyled list of the fixed stops' texts.
// Replaced by the real river of stops from T11 on.

// Grouped by the keys each stop has, so translation keys stay typed.
const TITLED = ["rive1", "forge", "escales", "delphes", "hermes"] as const;
const NARRATED = ["courant", "elysee"] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default function Home() {
  const t = useTranslations("Stops");

  return (
    <main className="flex flex-col gap-8 p-8">
      <LocaleSwitch />
      <section>
        <p className="font-mono">{t("embarcadere.chapter")}</p>
        <blockquote>{t("embarcadere.line")}</blockquote>
      </section>
      {NARRATED.map((stop) => (
        <section key={stop}>
          <p className="font-mono">{t(`${stop}.chapter`)}</p>
          <p>{t(`${stop}.narration`)}</p>
          <blockquote>{t(`${stop}.line`)}</blockquote>
        </section>
      ))}
      {TITLED.map((stop) => (
        <section key={stop}>
          <p className="font-mono">{t(`${stop}.chapter`)}</p>
          <h2>{t.rich(`${stop}.title`, { em })}</h2>
          <p>{t(`${stop}.narration`)}</p>
          <blockquote>{t(`${stop}.line`)}</blockquote>
        </section>
      ))}
      <p className="font-mono">{t("epreuves.chapter", { numeral: "I" })}</p>
    </main>
  );
}
