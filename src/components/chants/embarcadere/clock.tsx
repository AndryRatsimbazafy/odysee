"use client";

import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";

// Live time in the home port. The server renders "--:--" (the page is
// prerendered, any server time would be stale); the client fills it in.

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(locale: string) {
  let f = formatters.get(locale);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, {
      timeZone: "Indian/Antananarivo",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(locale, f);
  }
  return f;
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

export function Clock() {
  const locale = useLocale();
  const time = useSyncExternalStore(
    subscribe,
    () => formatter(locale).format(Date.now()),
    () => "--:--",
  );
  return <b>{time}</b>;
}
