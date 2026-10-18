import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabasePublishableKey, supabaseUrl } from "./env";

export const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Refreshes the Supabase session cookies on every /admin request, then
 * redirects visitors without a valid token to the login page. The redirect is
 * only a shortcut: layouts, pages and Server Actions still call requireAdmin().
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    supabaseUrl(),
    supabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // Verifies the JWT signature (never trust getSession() on the server).
  // Nothing may run between client creation and this call.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && request.nextUrl.pathname !== ADMIN_LOGIN_PATH) {
    const redirect = NextResponse.redirect(
      new URL(ADMIN_LOGIN_PATH, request.url),
    );
    // Keep the refreshed (or cleared) cookies and their cache headers.
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(header);
      if (value) redirect.headers.set(header, value);
    }
    response = redirect;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
