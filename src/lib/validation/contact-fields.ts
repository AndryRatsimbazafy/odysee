// Zod-free half of the contact contract: the Hermès form (client) imports
// it without pulling Zod into the public bundle (T25).

export const CONTACT_SUBJECTS = ["cdi", "freelance", "other"] as const;

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactErrorKey =
  "name" | "email" | "subject" | "message" | "tooLong";

export type ContactState = {
  status: "idle" | "success" | "error";
  error?: "invalid" | "tooFast" | "rateLimit" | "failed";
  fieldErrors?: Partial<Record<ContactField, ContactErrorKey>>;
  /** Sent back on error: React resets the form after the action. */
  values?: Partial<Record<ContactField, string>>;
  /** On success: the address the reply will go to. */
  sentTo?: string;
};
