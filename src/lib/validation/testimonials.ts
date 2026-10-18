import { z } from "zod";
import { text } from "./shared";

export const testimonialsSchema = z.object({
  testimonials: z
    .array(
      z.object({
        id: z.uuid().optional(),
        quote_fr: text(1500),
        quote_en: text(1500),
        author: text(120),
        role_fr: text(160),
        role_en: text(160),
        company: text(120),
        is_anonymized: z.boolean(),
        is_published: z.boolean(),
      }),
    )
    .max(30),
});

export type TestimonialsValues = z.infer<typeof testimonialsSchema>;
