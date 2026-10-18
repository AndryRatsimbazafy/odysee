import { getTranslations } from "next-intl/server";
import { FormSection } from "@/components/admin/form-section";
import { getResumesInfo, getSocialLinksForm } from "@/lib/data/admin";
import { LinksForm } from "./links-form";
import { ResumePanel } from "./resume-panel";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminLinksPage() {
  const [links, resumes, t] = await Promise.all([
    getSocialLinksForm(),
    getResumesInfo(),
    getTranslations("admin"),
  ]);

  return (
    <main className="gut grid flex-1 gap-10 py-12">
      <div>
        <h1 className="display text-4xl">{t("links.heading")}</h1>
        <p className="mt-3 text-muted-foreground">{t("links.lead")}</p>
      </div>
      <FormSection title={t("resumes.heading")}>
        <div className="grid gap-8 md:grid-cols-2">
          <ResumePanel locale="fr" initial={resumes.fr} />
          <ResumePanel locale="en" initial={resumes.en} />
        </div>
      </FormSection>
      <FormSection title={t("links.listHeading")}>
        <LinksForm defaultValues={links} />
      </FormSection>
    </main>
  );
}
