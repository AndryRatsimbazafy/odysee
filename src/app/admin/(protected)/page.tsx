import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/admin";

const SECTIONS = ["profile", "projects", "content"] as const;

export default async function AdminHome() {
  await requireAdmin();
  const t = await getTranslations("admin.dashboard");

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 text-muted-foreground">{t("lead")}</p>
      <ul className="mt-8 grid gap-2 border-t border-border pt-6">
        {SECTIONS.map((key) => (
          <li key={key} className="text-muted-foreground">
            {t(`sections.${key}`)}
          </li>
        ))}
      </ul>
    </main>
  );
}
