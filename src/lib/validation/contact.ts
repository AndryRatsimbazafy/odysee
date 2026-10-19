import { z } from "zod";
import { routing } from "@/i18n/routing";
import { CONTACT_SUBJECTS } from "./contact-fields";

export * from "./contact-fields";

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
