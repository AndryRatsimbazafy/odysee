"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** FR / EN links that keep the current path; plain links, so they work without JS. */
export function LocaleSwitch() {
  const t = useTranslations("LocaleSwitch");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="font-mono uppercase">
      {routing.locales.map((locale, i) => (
        <span key={locale}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          <Link
            href={pathname}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            aria-label={t(locale)}
            aria-current={locale === current ? "true" : undefined}
          >
            {locale}
          </Link>
        </span>
      ))}
    </nav>
  );
}
