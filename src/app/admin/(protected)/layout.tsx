import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Button } from "@/components/admin/button";
import { signOut } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth/admin";

// Session check before any protected page renders. Pages and Server Actions
// still call requireAdmin() themselves: a layout is not re-run on navigation.
async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <>
      <header className="gut flex items-center justify-between gap-4 border-b border-border py-4">
        <span className="kicker">{t("title")}</span>
        <div className="flex items-center gap-4">
          <span className="mono hidden sm:inline">
            {t("shell.signedInAs", { email: admin.email })}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              {t("shell.signOut")}
            </Button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}

export default async function ProtectedLayout({
  children,
}: LayoutProps<"/admin">) {
  const t = await getTranslations("admin.shell");

  return (
    <Suspense fallback={<p className="gut mono py-4">{t("checking")}</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
