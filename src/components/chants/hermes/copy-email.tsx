"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/** The public address and its "Copy" button; selects the text if copying fails. */
export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations("hermes");
  const [copied, setCopied] = useState(false);
  const address = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const select = () => {
    if (!address.current) return;
    const range = document.createRange();
    range.selectNodeContents(address.current);
    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      select();
    }
  };

  return (
    <div className="addr">
      <code ref={address}>{email}</code>
      <button className="copy" type="button" onClick={copy}>
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
    </div>
  );
}
