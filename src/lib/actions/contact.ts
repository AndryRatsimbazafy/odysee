"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  contactSchema,
  type ContactErrorKey,
  type ContactField,
  type ContactState,
} from "@/lib/validation/contact";

const MIN_DELAY_MS = 3000;
const MAX_PER_HOUR = 3;
const FIELDS: ContactField[] = ["name", "email", "subject", "message"];

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Salted SHA-256 of the client IP: the IP itself is never stored. */
async function ipHash(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return createHash("sha256")
    .update(requiredEnv("IP_HASH_SALT") + ip)
    .digest("hex");
}

/**
 * Chant VI · Writes to Hermès (ARCHITECTURE §6): honeypot, 3 s delay, Zod,
 * 3 messages per hour per hashed IP, saved first, then mailed. If the mail
 * fails, the message stays in the admin and the visitor sees the failure.
 */
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<ContactField, string>;

  // A filled honeypot is a bot: pretend it worked, keep nothing.
  if (formData.get("website"))
    return { status: "success", sentTo: values.email.trim() };

  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < MIN_DELAY_MS)
    return { status: "error", error: "tooFast", values };

  const parsed = contactSchema.safeParse({
    ...values,
    locale: formData.get("locale"),
  });
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      if (FIELDS.includes(field) && !fieldErrors[field])
        fieldErrors[field] = issue.message as ContactErrorKey;
    }
    return { status: "error", error: "invalid", fieldErrors, values };
  }
  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    const hash = await ipHash();

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", hash)
      .gt("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= MAX_PER_HOUR)
      return { status: "error", error: "rateLimit", values };

    const { data: row, error: insertError } = await supabase
      .from("contact_messages")
      .insert({ ...data, ip_hash: hash })
      .select("id")
      .single();
    if (insertError) throw insertError;

    try {
      const user = requiredEnv("SMTP_USER");
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass: requiredEnv("SMTP_APP_PASSWORD") },
      });
      await transport.sendMail({
        from: `Hermès <${user}>`,
        to: requiredEnv("CONTACT_TO_EMAIL"),
        replyTo: { name: data.name, address: data.email },
        subject: `[Hermès] ${data.subject} · ${data.name}`,
        text: `${data.name} <${data.email}> · ${data.subject} · ${data.locale}\n\n${data.message}`,
      });
    } catch (mailError) {
      console.error("contact: mail failed", mailError);
      return { status: "error", error: "failed", values };
    }

    await supabase
      .from("contact_messages")
      .update({ email_sent: true })
      .eq("id", row.id);
    return { status: "success", sentTo: data.email };
  } catch (error) {
    console.error("contact: failed", error);
    return { status: "error", error: "failed", values };
  }
}
