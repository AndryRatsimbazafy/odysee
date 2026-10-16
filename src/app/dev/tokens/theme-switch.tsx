"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const THEMES = [
  { value: "light", label: "Hélios" },
  { value: "dark", label: "Nyx" },
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
            className="min-h-11 border-b-2 border-or font-display text-[19px] text-encre-2 transition-colors hover:text-terre aria-pressed:border-terre aria-pressed:text-terre aria-pressed:italic"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
