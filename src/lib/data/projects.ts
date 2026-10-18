import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { bySortOrder, pick } from "./localize";
import { mediaUrl } from "./storage";
import { TAGS } from "./tags";
import type {
  PlateRatio,
  Project,
  ProjectKind,
  ProjectLayout,
  ProjectLink,
  ProjectSummary,
} from "./types";

// RLS already hides drafts from the publishable key; the status filter keeps
// the intent explicit (and correct if the client ever changes).
const SUMMARY_SELECT = `*,
  project_images(path, kind_fr, kind_en, alt_fr, alt_en, ratio, sort_order),
  project_technologies(sort_order, technologies(name))` as const;

const DETAIL_SELECT = `*,
  project_items(*),
  project_decisions(*),
  project_images(*),
  project_technologies(sort_order, usage_fr, usage_en, technologies(name, weapon))` as const;

async function getProjectRows() {
  "use cache";
  cacheTag(TAGS.projects, TAGS.technologies);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("projects")
    .select(SUMMARY_SELECT)
    .eq("status", "published")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(`projects: ${error.message}`);
  return data;
}

async function getProjectRow(slug: string) {
  "use cache";
  cacheTag(TAGS.projects, TAGS.technologies);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("projects")
    .select(DETAIL_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`project ${slug}: ${error.message}`);
  return data;
}

type SummaryRow = Awaited<ReturnType<typeof getProjectRows>>[number];
type DetailRow = NonNullable<Awaited<ReturnType<typeof getProjectRow>>>;

function toSummary(
  row: SummaryRow | DetailRow,
  index: number,
  locale: Locale,
): ProjectSummary {
  const first = [...row.project_images].sort(bySortOrder)[0];
  return {
    id: row.id,
    slug: row.slug,
    index,
    title: pick(row, "title", locale),
    shortTitle: pick(row, "short_title", locale) || pick(row, "title", locale),
    kind: row.kind as ProjectKind,
    kindLabel: pick(row, "kind_label", locale),
    layout: row.layout as ProjectLayout,
    emblem: row.emblem,
    isConfidential: row.is_confidential,
    isAssociative: row.is_associative,
    isFeatured: row.is_featured,
    summary: pick(row, "summary", locale),
    quest: pick(row, "quest", locale),
    charonLine: pick(row, "charon_line", locale),
    period: pick(row, "period", locale),
    stack: [...row.project_technologies]
      .sort(bySortOrder)
      .flatMap((pt) => (pt.technologies ? [pt.technologies.name] : [])),
    firstPlate: first
      ? {
          src: mediaUrl(createPublicClient(), first.path),
          kind: pick(first, "kind", locale),
          alt: pick(first, "alt", locale),
          ratio: first.ratio as PlateRatio,
        }
      : null,
  };
}

/** Published projects, in chart order. */
export async function getProjects(locale: Locale): Promise<ProjectSummary[]> {
  const rows = await getProjectRows();
  return rows.map((row, i) => toSummary(row, i + 1, locale));
}

/** Slugs of published projects (generateStaticParams, sitemap). */
export async function getProjectSlugs(): Promise<string[]> {
  const rows = await getProjectRows();
  return rows.map((row) => row.slug);
}

/** Lightweight links to published projects, keyed by id (used by the arsenal). */
export async function getProjectLinks(
  locale: Locale,
): Promise<Map<string, ProjectLink>> {
  const rows = await getProjectRows();
  return new Map(
    rows.map((row, i) => [
      row.id,
      { slug: row.slug, title: pick(row, "title", locale), index: i + 1 },
    ]),
  );
}

/** The full dossier of a published project, or null (→ notFound / redirect). */
export async function getProject(
  locale: Locale,
  slug: string,
): Promise<Project | null> {
  const [row, rows] = await Promise.all([getProjectRow(slug), getProjectRows()]);
  if (!row) return null;

  const position = rows.findIndex((r) => r.id === row.id);
  const link = (r: SummaryRow | undefined, i: number): ProjectLink | null =>
    r ? { slug: r.slug, title: pick(r, "title", locale), index: i + 1 } : null;

  const client = createPublicClient();
  const items = [...row.project_items].sort(bySortOrder);
  const itemsOf = (kind: "contribution" | "result") =>
    items.filter((it) => it.kind === kind).map((it) => pick(it, "text", locale));
  const confidential = row.is_confidential;
  const cover = mediaUrl(client, row.cover_path);

  return {
    ...toSummary(row, position + 1, locale),
    roleShort: pick(row, "role", locale),
    roleText: pick(row, "role_label", locale),
    team: pick(row, "team", locale),
    client:
      row.show_client && !confidential && row.client_name
        ? row.client_name
        : null,
    context: pick(row, "context", locale),
    problem: pick(row, "problem", locale),
    contributions: itemsOf("contribution"),
    results: itemsOf("result"),
    decisions: [...row.project_decisions].sort(bySortOrder).map((d) => ({
      title: pick(d, "title", locale),
      why: pick(d, "why", locale),
      tradeoff: pick(d, "tradeoff", locale),
    })),
    plates: [...row.project_images].sort(bySortOrder).map((img) => ({
      id: img.id,
      src: mediaUrl(client, img.path),
      kind: pick(img, "kind", locale),
      caption: pick(img, "caption", locale),
      alt: pick(img, "alt", locale),
      ratio: img.ratio as PlateRatio,
    })),
    technologies: [...row.project_technologies]
      .sort(bySortOrder)
      .flatMap((pt) =>
        pt.technologies
          ? [
              {
                name: pt.technologies.name,
                weapon: pt.technologies.weapon,
                usage: pick(pt, "usage", locale),
              },
            ]
          : [],
      ),
    links: {
      demo: confidential ? null : row.demo_url,
      repo: confidential ? null : row.repo_url,
    },
    cover: cover ? { src: cover, alt: pick(row, "cover_alt", locale) } : null,
    seo: {
      title: pick(row, "seo_title", locale),
      description: pick(row, "seo_description", locale),
      ogImage: mediaUrl(client, row.og_image_path),
    },
    updatedAt: row.updated_at,
    previous: position > 0 ? link(rows[position - 1], position - 1) : null,
    next: link(rows[position + 1], position + 1),
  };
}

async function getRedirectRow(oldSlug: string) {
  "use cache";
  cacheTag(TAGS.projects);
  cacheLife("max");

  const { data, error } = await createPublicClient()
    .from("slug_redirects")
    .select("projects(slug, status)")
    .eq("old_slug", oldSlug)
    .maybeSingle();
  if (error) throw new Error(`slug redirect ${oldSlug}: ${error.message}`);
  return data;
}

/** Current slug for a renamed project (SEO-10), or null. */
export async function resolveSlugRedirect(
  oldSlug: string,
): Promise<string | null> {
  const row = await getRedirectRow(oldSlug);
  const target = row?.projects;
  return target && target.status === "published" ? target.slug : null;
}
