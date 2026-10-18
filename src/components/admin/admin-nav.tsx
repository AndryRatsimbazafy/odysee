"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const ITEMS = [
  { href: "/admin", key: "dashboard" },
  { href: "/admin/profile", key: "profile" },
  { href: "/admin/engagement", key: "engagement" },
  { href: "/admin/links", key: "links" },
] as const;

export function AdminNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {ITEMS.map(({ href, key }) => {
          const current = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "text-or-clair"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
