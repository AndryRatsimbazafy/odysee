import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdmin } from "@/lib/auth/admin";
import { LoginForm } from "./login-form";

// Already signed in: skip the form. Reads cookies, hence the Suspense below.
async function RedirectIfAdmin() {
  if (await getAdmin()) redirect("/admin");
  return null;
}

export default async function LoginPage() {
  const t = await getTranslations("admin.login");

  return (
    <main className="gut flex flex-1 items-center py-16">
      <Suspense fallback={null}>
        <RedirectIfAdmin />
      </Suspense>
      <div className="w-full max-w-sm">
        <h1 className="kicker">{t("heading")}</h1>
        <p className="mt-3 text-muted-foreground">{t("lead")}</p>
        <LoginForm
          labels={{
            email: t("email"),
            password: t("password"),
            submit: t("submit"),
            pending: t("pending"),
          }}
          errors={{
            invalid: t("errors.invalid"),
            forbidden: t("errors.forbidden"),
            unavailable: t("errors.unavailable"),
          }}
        />
      </div>
    </main>
  );
}
