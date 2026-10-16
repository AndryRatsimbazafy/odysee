import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  // Public site only: admin, API, dev sheets, Next internals and files are skipped.
  // `(?:/|$)` keeps public paths that merely start with those words (/devis).
  matcher: ["/((?!(?:admin|api|dev)(?:/|$)|_next|_vercel|.*\\..*).*)"],
};
