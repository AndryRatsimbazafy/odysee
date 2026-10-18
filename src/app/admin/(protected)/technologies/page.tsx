import { getTranslations } from "next-intl/server";
import { getTechnologiesForm } from "@/lib/data/admin";
import { TechnologiesForm } from "./technologies-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminTechnologiesPage() {
  const [values, t] = await Promise.all([
    getTechnologiesForm(),
    getTranslations("admin.technologies"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <TechnologiesForm defaultValues={values} />
    </main>
  );
}
