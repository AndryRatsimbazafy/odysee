import { getTranslations } from "next-intl/server";
import { getEngagementsForm } from "@/lib/data/admin";
import { EngagementForm } from "./engagement-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminEngagementPage() {
  const [values, t] = await Promise.all([
    getEngagementsForm(),
    getTranslations("admin.engagement"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <EngagementForm defaultValues={values} />
    </main>
  );
}
