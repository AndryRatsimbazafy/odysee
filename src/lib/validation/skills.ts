import { z } from "zod";
import { text } from "./shared";

export const SKILL_DOMAINS = ["hephaistos", "athena"] as const;

const skill = z.object({
  id: z.uuid().optional(),
  label_fr: text(120),
  label_en: text(120),
  description_fr: text(600),
  description_en: text(600),
});

/** One ordered list per god (Chant I): the domain is the list. */
export const skillsSchema = z.object({
  hephaistos: z.array(skill).max(30),
  athena: z.array(skill).max(30),
});

export type SkillsValues = z.infer<typeof skillsSchema>;
