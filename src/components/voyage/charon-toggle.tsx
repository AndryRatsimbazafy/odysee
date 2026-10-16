"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { glossShown, setGlossShown, subscribeGloss } from "./gloss-store";

/** Shows or hides Charon's glosses everywhere; the choice is remembered. */
export function CharonToggle() {
  const t = useTranslations("voyage.charon");
  const on = useSyncExternalStore(subscribeGloss, glossShown, () => true);

  return (
    <button
      type="button"
      className="gl"
      aria-pressed={on}
      title={t("toggleTitle")}
      onClick={() => setGlossShown(!on)}
    >
      {on ? t("toggle") : t("toggleOff")}
    </button>
  );
}
