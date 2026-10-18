import { z } from "zod";
import { text } from "./shared";

export const faqSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.uuid().optional(),
        question_fr: text(300),
        question_en: text(300),
        answer_fr: text(2000),
        answer_en: text(2000),
        is_published: z.boolean(),
      }),
    )
    .max(40),
});

export type FaqValues = z.infer<typeof faqSchema>;
