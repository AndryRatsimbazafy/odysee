"use server";

// Every write action in this folder must start with `await requireAdmin()`
// (src/lib/auth/admin.ts): the proxy and the layouts are not a security layer.

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";

export type SignInState = {
  error: "invalid" | "forbidden" | "unavailable";
  email: string;
} | null;

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const parsed = signInSchema.safeParse({
    email,
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid", email };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Same message for unknown email and wrong password.
    const status = error.status ?? 500;
    return { error: status >= 500 ? "unavailable" : "invalid", email };
  }

  const { data: row } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { error: "forbidden", email };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
