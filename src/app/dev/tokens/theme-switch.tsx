"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const THEMES = [
  { value: "dark", label: "Nuit" },
  { value: "light", label: "Ivoire" },
  { value: "system", label: "Système" },
] as const;

const noop = () => () => {};

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  return (
    <div className="flex gap-6">
      {THEMES.map(({ value, label }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className="min-h-11 border-b border-filet font-display text-[19px] text-cendre transition-colors hover:text-or-clair aria-pressed:border-or aria-pressed:text-or-clair aria-pressed:italic"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
