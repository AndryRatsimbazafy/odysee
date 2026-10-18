import { z } from "zod";
import { text } from "./shared";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const experiencesSchema = z.object({
  experiences: z
    .array(
      z
        .object({
          id: z.uuid().optional(),
          company: text(120).min(1),
          role_fr: text(160),
          role_en: text(160),
          start_date: date,
          // Empty = ongoing ("en cours").
          end_date: z.union([z.literal(""), date]),
          location: text(120),
          is_remote: z.boolean(),
          message_fr: text(1000),
          message_en: text(1000),
          technology_ids: z.array(z.uuid()).max(30),
        })
        .refine((e) => !e.end_date || e.end_date >= e.start_date, {
          path: ["end_date"],
        }),
    )
    .max(40),
});

export type ExperiencesValues = z.infer<typeof experiencesSchema>;
