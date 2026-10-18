import { z } from "zod";
import { Constants } from "@/types/database";
import { text } from "./shared";

/** Closed list of the arsenal's weapons (DESIGN §5); none = next of the reserve. */
export const WEAPONS = Constants.public.Enums.weapon;

export const technologiesSchema = z.object({
  technologies: z
    .array(
      z.object({
        id: z.uuid().optional(),
        name: text(60).min(1),
        category: text(60),
        // numeric(3,1) as typed in the field ("4", "2.5"), or empty.
        years_of_use: z.union([
          z.literal(""),
          z.string().regex(/^\d{1,2}([.,]\d)?$/),
        ]),
        duration_label_fr: text(60),
        duration_label_en: text(60),
        weapon: z.union([z.literal(""), z.enum(WEAPONS)]),
        role_fr: text(300),
        role_en: text(300),
        context_fr: text(600),
        context_en: text(600),
        is_featured: z.boolean(),
      }),
    )
    .max(60)
    .refine(
      (list) =>
        new Set(list.map((t) => t.name.toLowerCase())).size === list.length,
    ),
});

export type TechnologiesValues = z.infer<typeof technologiesSchema>;
