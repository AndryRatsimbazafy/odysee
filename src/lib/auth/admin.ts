import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ADMIN_LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

export type Admin = { id: string; email: string };

/**
 * Signed-in admin, or null. Verifies the JWT (getClaims) then checks the
 * `admins` table, so a valid Supabase account that is not Andry's gets null.
 * Reads cookies: call it under <Suspense>, never inside `'use cache'`.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: row } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();
  if (!row) return null;

  return { id: claims.sub, email: claims.email ?? "" };
});

/**
 * Guard for every admin layout, page and Server Action (F-ADM-02).
 * proxy.ts is not enough: it only checks the cookie, and Server Actions can be
 * called directly.
 */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
