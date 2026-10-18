import { z } from "zod";
import { optionalUrl, text } from "./shared";

export const engagementsSchema = z.object({
  engagements: z
    .array(
      z.object({
        id: z.uuid().optional(),
        organization: text(160).min(1),
        // <input type="number"> value as text, or empty.
        since: z.union([z.literal(""), z.string().regex(/^(19|20)\d{2}$/)]),
        url: optionalUrl,
        text_fr: text(2000),
        text_en: text(2000),
        roles: z
          .array(
            z.object({
              label_fr: text(160),
              label_en: text(160),
              period: text(60),
            }),
          )
          .max(20),
      }),
    )
    .max(20),
});

export type EngagementsValues = z.infer<typeof engagementsSchema>;
