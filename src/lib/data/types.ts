// View types: what the public components receive, already localized
// (EN → FR fallback applied). Database rows never leave src/lib/data.
import type { Database } from "@/types/database";

type Enums = Database["public"]["Enums"];

export type Emblem = Enums["project_emblem"];
export type Weapon = Enums["weapon"];
export type ProjectKind = "client" | "associative" | "personal";
export type ProjectLayout = "sealed" | "split" | "gallery" | "process";
export type PlateRatio = "16/10" | "1/1" | "4/5" | "21/9" | "3/4" | "16/9";
export type SkillDomain = "hephaistos" | "athena";
export type AvailabilityMode = "cdi" | "freelance" | "remote";

export type Profile = {
  fullName: string;
  title: string;
  /** May contain inline <em>. */
  tagline: string;
  recit: string;
  bio: string;
  hephaistos: string;
  athena: string;
  location: string;
  languages: string;
  isAvailable: boolean;
  availabilityModes: AvailabilityMode[];
  availability: string;
  /** ISO date, null = "[à fournir]". */
  availableFrom: string | null;
  publicEmail: string;
  photo: { src: string; alt: string } | null;
  seo: { title: string; description: string; ogImage: string | null };
};

/** A project as shown on the chart and in the previews (chant II). */
export type ProjectSummary = {
  id: string;
  slug: string;
  /** 1-based position among published projects (roman numeral source). */
  index: number;
  title: string;
  shortTitle: string;
  kind: ProjectKind;
  kindLabel: string;
  layout: ProjectLayout;
  emblem: Emblem | null;
  isConfidential: boolean;
  isAssociative: boolean;
  isFeatured: boolean;
  summary: string;
  quest: string;
  charonLine: string;
  period: string;
  /** Technology names, in project order. */
  stack: string[];
};

export type ProjectDecision = { title: string; why: string; tradeoff: string };

export type Plate = {
  id: string;
  /** Public storage URL, null = empty slot ("[à fournir]"). */
  src: string | null;
  kind: string;
  caption: string;
  alt: string;
  ratio: PlateRatio;
};

export type ProjectTechnology = {
  name: string;
  weapon: Weapon | null;
  usage: string;
};

export type ProjectLink = { slug: string; title: string; index: number };

/** The full archive dossier. */
export type Project = ProjectSummary & {
  /** Short role for the record card (Période · Rôle · Équipe · Client). */
  roleShort: string;
  /** Detailed role, opening "Ma contribution". */
  roleText: string;
  team: string;
  /** Null when hidden (confidential or not shown). */
  client: string | null;
  context: string;
  problem: string;
  contributions: string[];
  results: string[];
  decisions: ProjectDecision[];
  plates: Plate[];
  technologies: ProjectTechnology[];
  /** Always null for confidential projects. */
  links: { demo: string | null; repo: string | null };
  cover: { src: string; alt: string } | null;
  seo: { title: string; description: string; ogImage: string | null };
  updatedAt: string;
  previous: ProjectLink | null;
  next: ProjectLink | null;
};

export type Technology = {
  id: string;
  name: string;
  category: string;
  yearsOfUse: number | null;
  durationLabel: string;
  weapon: Weapon | null;
  role: string;
  context: string;
  isFeatured: boolean;
  /** Published projects that used it (arsenal cross-references). */
  projects: ProjectLink[];
};

export type Skill = {
  id: string;
  domain: SkillDomain;
  label: string;
  description: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  /** ISO dates; endDate null = current port. */
  startDate: string;
  endDate: string | null;
  location: string;
  isRemote: boolean;
  message: string;
  technologies: string[];
};

export type FaqItem = { id: string; question: string; answer: string };

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  isAnonymized: boolean;
};
