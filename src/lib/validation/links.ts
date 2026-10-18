import { z } from "zod";
import { text } from "./shared";

export const socialLinksSchema = z.object({
  links: z
    .array(
      z.object({
        id: z.uuid().optional(),
        platform: text(40).min(1),
        url: z.url({ protocol: /^https?$/ }),
      }),
    )
    .max(20),
});

export type SocialLinksValues = z.infer<typeof socialLinksSchema>;
