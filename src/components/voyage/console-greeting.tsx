"use client";

import { useEffect } from "react";

let greeted = false;

/** A word for the developers who open the console (STORYBOARD §10). Once. */
export function ConsoleGreeting({
  message,
  url,
}: {
  message: string;
  url: string | null;
}) {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.info(
      `%c${message}${url ? `\n${url}` : ""}`,
      "font: italic 16px/1.5 Georgia, serif; color: #d2b985;",
    );
  }, [message, url]);
  return null;
}
