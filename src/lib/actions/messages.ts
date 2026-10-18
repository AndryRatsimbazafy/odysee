"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { SaveResult } from "@/lib/validation/shared";

// Contact messages are admin-only: no public cache to refresh.

const messageId = z.uuid();

export async function setMessageStatus(
  id: string,
  status: "read" | "unread",
): Promise<SaveResult> {
  await requireAdmin();
  if (!messageId.safeParse(id).success || !["read", "unread"].includes(status))
    return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}

export async function deleteMessage(id: string): Promise<SaveResult> {
  await requireAdmin();
  if (!messageId.safeParse(id).success) return { ok: false, error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: "failed" };
  return { ok: true, data: undefined };
}
