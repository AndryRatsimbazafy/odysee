import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getAdmin } from "@/lib/auth/admin";

// Admin preview of a draft dossier (F-ADM-09): turns Draft Mode on for this
// browser, then opens the preview page. `?disable` turns it off again.
// Draft Mode alone is not trusted: the preview page checks the admin too.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const draft = await draftMode();

  if (searchParams.has("disable")) {
    draft.disable();
    redirect("/");
  }
  if (!(await getAdmin())) {
    return new Response(null, { status: 401 });
  }
  const id = searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response(null, { status: 400 });
  }
  draft.enable();
  redirect(`/fr/preview/${id}`);
}
