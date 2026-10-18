import { getTranslations } from "next-intl/server";

// Suspense boundary for every admin page: their reads are request-time.
export default async function AdminLoading() {
  const t = await getTranslations("admin.form");
  return <p className="gut mono flex-1 py-12">{t("loading")}</p>;
}
