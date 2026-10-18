import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

const SECTIONS = [
  { key: "profile", href: "/admin/profile" },
  { key: "engagement", href: "/admin/engagement" },
  { key: "links", href: "/admin/links" },
  { key: "projects", href: null },
  { key: "content", href: null },
] as const;

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminHome() {
  await requireAdmin();
  const t = await getTranslations("admin.dashboard");

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 text-muted-foreground">{t("lead")}</p>
      <ul className="mt-8 grid gap-2 border-t border-border pt-6">
        {SECTIONS.map(({ key, href }) => (
          <li key={key}>
            {href ? (
              <Link
                href={href}
                className="underline underline-offset-4 hover:text-or-clair"
              >
                {t(`sections.${key}`)}
              </Link>
            ) : (
              <span className="text-muted-foreground">
                {t(`sections.${key}`)} <span className="todo">{t("soon")}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
