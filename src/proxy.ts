import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/proxy";

const intl = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Admin is outside i18n: it only needs its Supabase session refreshed.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateSession(request);
  }
  return intl(request);
}

export const config = {
  // Public site and admin; API, dev sheets, Next internals and files are skipped.
  // `(?:/|$)` keeps public paths that merely start with those words (/devis).
  matcher: ["/((?!(?:api|dev)(?:/|$)|_next|_vercel|.*\\..*).*)"],
};
