import { z } from "zod";
import { routing } from "@/i18n/routing";

export const CONTACT_SUBJECTS = ["cdi", "freelance", "other"] as const;

/**
 * Hermès form. Error messages are keys of `hermes.errors` (messages/*.json),
 * translated by the form, so the schema stays language-free.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "name").max(120, "name"),
  email: z.string().trim().max(254, "email").pipe(z.email("email")),
  subject: z.enum(CONTACT_SUBJECTS, "subject"),
  message: z.string().trim().min(20, "message").max(5000, "tooLong"),
  locale: z.enum(routing.locales),
});

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactErrorKey =
  "name" | "email" | "subject" | "message" | "tooLong";

export type ContactState = {
  status: "idle" | "success" | "error";
  error?: "invalid" | "tooFast" | "rateLimit" | "failed";
  fieldErrors?: Partial<Record<ContactField, ContactErrorKey>>;
  /** Sent back on error: React resets the form after the action. */
  values?: Partial<Record<ContactField, string>>;
};
