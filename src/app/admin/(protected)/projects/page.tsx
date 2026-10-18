import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/admin/button";
import { getProjectsList } from "@/lib/data/admin";
import { ProjectsList } from "./projects-list";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminProjectsPage() {
  const [projects, t] = await Promise.all([
    getProjectsList(),
    getTranslations("admin.projects"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl">{t("heading")}</h1>
        <Button asChild>
          <Link href="/admin/projects/new">{t("new")}</Link>
        </Button>
      </div>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <ProjectsList projects={projects} />
    </main>
  );
}
