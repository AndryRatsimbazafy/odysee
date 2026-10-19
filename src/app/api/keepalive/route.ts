import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Daily Vercel cron (vercel.json): one light read keeps the free Supabase
// project from pausing after a week without activity (ARCHITECTURE §4).
// Vercel sends `Authorization: Bearer <CRON_SECRET>`; anything else is
// refused. Reading the request makes the handler run on every call.

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const { error } = await createAdminClient()
    .from("profile")
    .select("id", { head: true, count: "exact" });
  if (error) {
    return Response.json({ ok: false }, { status: 503 });
  }
  return Response.json({ ok: true });
}
