import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { NewProjectForm } from "./new-project-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminNewProjectPage() {
  await requireAdmin();
  const t = await getTranslations("admin.projects.create");

  return (
    <main className="gut flex-1 py-12">
      <Link
        href="/admin/projects"
        className="mono text-muted-foreground hover:text-foreground"
      >
        {t("back")}
      </Link>
      <h1 className="display mt-4 text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <NewProjectForm />
    </main>
  );
}
