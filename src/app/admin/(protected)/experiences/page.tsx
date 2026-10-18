import { getTranslations } from "next-intl/server";
import { getExperiencesForm, getTechnologyOptions } from "@/lib/data/admin";
import { ExperiencesForm } from "./experiences-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminExperiencesPage() {
  const [values, technologies, t] = await Promise.all([
    getExperiencesForm(),
    getTechnologyOptions(),
    getTranslations("admin.experiences"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <ExperiencesForm defaultValues={values} technologies={technologies} />
    </main>
  );
}
