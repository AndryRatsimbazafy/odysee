"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

const THEMES = ["dark", "light"] as const;
const noop = () => () => {};

/** Night / Day segmented switch (night is the default). */
export function ThemeToggle() {
  const t = useTranslations("voyage.header.theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  return (
    <div className="seg" role="group" aria-label={t("label")}>
      {THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          aria-pressed={mounted && resolvedTheme === theme}
          onClick={() => setTheme(theme)}
        >
          {t(theme)}
        </button>
      ))}
    </div>
  );
}
