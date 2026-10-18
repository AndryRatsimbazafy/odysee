import { z } from "zod";
import { Constants } from "@/types/database";
import { mediaPath, optionalUrl, text } from "./shared";

// Same values as the SQL checks and enums (projects / schema_v3_luxe4).
export const PROJECT_STATUSES = Constants.public.Enums.project_status;
export const PROJECT_EMBLEMS = Constants.public.Enums.project_emblem;
export const PROJECT_KINDS = ["client", "associative", "personal"] as const;
export const PROJECT_LAYOUTS = [
  "sealed",
  "split",
  "gallery",
  "process",
] as const;
export const PLATE_RATIOS = [
  "16/10",
  "1/1",
  "4/5",
  "21/9",
  "3/4",
  "16/9",
] as const;

/** Plates per dossier (F-ADM-08b): fewer is allowed while drafting. */
export const MIN_PLATES = 4;
export const MAX_PLATES = 5;

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slug = z.string().trim().min(1).max(80).regex(SLUG_PATTERN);

/** Readable, stable slug from a title (SEO-10): "Écran Hydre" → "ecran-hydre". */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** Images of a project: `projects/{project_id}/{uuid}.{ext}` in `media`. */
const projectMediaPath = mediaPath("projects/[0-9a-f-]{36}");

const item = z.object({ text_fr: text(600), text_en: text(600) });

const decision = z.object({
  title_fr: text(200),
  title_en: text(200),
  why_fr: text(1500),
  why_en: text(1500),
  tradeoff_fr: text(1500),
  tradeoff_en: text(1500),
});

// A plate without image is a "[à fournir]" slot; an image needs its alt (SEO-09).
const plate = z
  .object({
    id: z.uuid().optional(),
    path: projectMediaPath,
    kind_fr: text(80),
    kind_en: text(80),
    caption_fr: text(300),
    caption_en: text(300),
    alt_fr: text(300),
    alt_en: text(300),
    ratio: z.enum(PLATE_RATIOS),
  })
  .refine((p) => !p.path || p.alt_fr.length > 0, { path: ["alt_fr"] });

const technology = z.object({
  technology_id: z.uuid(),
  usage_fr: text(300),
  usage_en: text(300),
});

export const projectSchema = z.object({
  status: z.enum(PROJECT_STATUSES),
  slug,
  // Récit
  title_fr: text(160).min(1),
  title_en: text(160),
  short_title_fr: text(60),
  short_title_en: text(60),
  quest_fr: text(300),
  quest_en: text(300),
  charon_line_fr: text(300),
  charon_line_en: text(300),
  summary_fr: text(1000),
  summary_en: text(1000),
  context_fr: text(4000),
  context_en: text(4000),
  problem_fr: text(4000),
  problem_en: text(4000),
  // Fiche
  kind: z.enum(PROJECT_KINDS),
  kind_label_fr: text(60),
  kind_label_en: text(60),
  layout: z.enum(PROJECT_LAYOUTS),
  emblem: z.union([z.literal(""), z.enum(PROJECT_EMBLEMS)]),
  period_fr: text(60),
  period_en: text(60),
  role_fr: text(160),
  role_en: text(160),
  role_label_fr: text(2000),
  role_label_en: text(2000),
  team_fr: text(300),
  team_en: text(300),
  client_name: text(160),
  show_client: z.boolean(),
  is_confidential: z.boolean(),
  demo_url: optionalUrl,
  repo_url: optionalUrl,
  // Contribution et décisions
  contributions: z.array(item).max(20),
  results: z.array(item).max(20),
  decisions: z.array(decision).max(12),
  // Planches
  plates: z.array(plate).max(MAX_PLATES),
  // Technos
  technologies: z
    .array(technology)
    .max(40)
    .refine(
      (list) => new Set(list.map((t) => t.technology_id)).size === list.length,
    ),
  // SEO
  seo_title_fr: text(70),
  seo_title_en: text(70),
  seo_description_fr: text(170),
  seo_description_en: text(170),
  og_image_path: projectMediaPath,
});

export type ProjectValues = z.infer<typeof projectSchema>;

export const newProjectSchema = z.object({
  title_fr: text(160).min(1),
  title_en: text(160),
  slug,
});

export type NewProjectValues = z.infer<typeof newProjectSchema>;

export const projectOrderSchema = z
  .array(z.uuid())
  .max(200)
  .refine((ids) => new Set(ids).size === ids.length);

// Tabs of the project form and the bilingual pairs each one holds -----------

export const PROJECT_TABS = [
  "story",
  "sheet",
  "work",
  "plates",
  "stack",
  "seo",
] as const;

export type ProjectTab = (typeof PROJECT_TABS)[number];

const FIELD_PAIRS: Partial<Record<ProjectTab, string[]>> = {
  story: [
    "title",
    "short_title",
    "quest",
    "charon_line",
    "summary",
    "context",
    "problem",
  ],
  sheet: ["kind_label", "period", "role", "role_label", "team"],
  seo: ["seo_title", "seo_description"],
};

const LIST_PAIRS = {
  contributions: { tab: "work", keys: ["text"] },
  results: { tab: "work", keys: ["text"] },
  decisions: { tab: "work", keys: ["title", "why", "tradeoff"] },
  plates: { tab: "plates", keys: ["kind", "caption", "alt"] },
  technologies: { tab: "stack", keys: ["usage"] },
} as const satisfies Record<string, { tab: ProjectTab; keys: string[] }>;

/** Tab holding a top-level field (used to reveal the tab of an error). */
export function tabOfField(field: string): ProjectTab {
  if (field in LIST_PAIRS)
    return LIST_PAIRS[field as keyof typeof LIST_PAIRS].tab;
  if (field === "og_image_path") return "seo";
  for (const [tab, keys] of Object.entries(FIELD_PAIRS)) {
    if (keys.some((key) => field === `${key}_fr` || field === `${key}_en`)) {
      return tab as ProjectTab;
    }
  }
  return "sheet";
}

const isMissing = (value: string, other: string) =>
  !value.trim() && !!other.trim();

/** Bilingual pairs with exactly one side filled, per tab (F-ADM-08). */
export function missingByTab(
  values: ProjectValues,
): Record<ProjectTab, number> {
  const counts = Object.fromEntries(
    PROJECT_TABS.map((tab) => [tab, 0]),
  ) as Record<ProjectTab, number>;
  const check = (
    tab: ProjectTab,
    row: Record<string, unknown>,
    key: string,
  ) => {
    const fr = String(row[`${key}_fr`] ?? "");
    const en = String(row[`${key}_en`] ?? "");
    if (isMissing(fr, en) || isMissing(en, fr)) counts[tab]++;
  };

  for (const [tab, keys] of Object.entries(FIELD_PAIRS)) {
    for (const key of keys) check(tab as ProjectTab, values, key);
  }
  for (const [list, { tab, keys }] of Object.entries(LIST_PAIRS)) {
    for (const row of values[list as keyof typeof LIST_PAIRS] ?? []) {
      for (const key of keys) check(tab, row, key);
    }
  }
  return counts;
}
