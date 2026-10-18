import { getTranslations } from "next-intl/server";
import { getTestimonialsForm } from "@/lib/data/admin";
import { TestimonialsForm } from "./testimonials-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminTestimonialsPage() {
  const [values, t] = await Promise.all([
    getTestimonialsForm(),
    getTranslations("admin.testimonials"),
  ]);

  return (
    <main className="gut flex-1 py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <p className="mt-3 mb-10 text-muted-foreground">{t("lead")}</p>
      <TestimonialsForm defaultValues={values} />
    </main>
  );
}
