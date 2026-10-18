import { useTranslations } from "next-intl";
import { CompassRoseEngraving } from "@/components/engravings/compass-rose";
import { Link } from "@/i18n/navigation";

/** 404 · Lost between Charybdis and Scylla (STORYBOARD §10). */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="lost gut" aria-labelledby="lost-title">
      <CompassRoseEngraving className="lost-rose" />
      <h1 id="lost-title" className="display">
        {t("title")}
      </h1>
      <p className="lost-links">
        <Link className="btn" href="/#embarcadere">
          {t("home")}
        </Link>
        <Link className="btn ghost" href="/#epreuves">
          {t("epreuves")}
        </Link>
      </p>
    </section>
  );
}
