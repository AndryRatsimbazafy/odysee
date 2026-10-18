import "server-only";
import type { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/database";

type Client = Awaited<ReturnType<typeof createClient>>;
type ListTable =
  "technologies" | "skills" | "experiences" | "faq_items" | "testimonials";

/**
 * Replaces a whole ordered table with the submitted rows: upsert by id
 * (new rows get one here), then delete the rows left out. Not atomic, like
 * the other admin forms. Returns the saved ids in order, or null on error.
 */
export async function replaceList<T extends ListTable>(
  supabase: Client,
  table: T,
  rows: (Omit<TablesInsert<T>, "id" | "sort_order"> & { id?: string })[],
): Promise<string[] | null> {
  // supabase-js cannot type a query over a union of tables: the rows are
  // typed by the signature above, the queries go through one concrete table.
  const from = () => supabase.from(table as "skills");

  const { data: existing, error: readError } = await from().select("id");
  if (readError) return null;

  const owned = new Set(existing.map((row) => row.id));
  const saved = rows.map((row, index) => ({
    ...row,
    id: row.id && owned.has(row.id) ? row.id : crypto.randomUUID(),
    sort_order: index,
  }));
  const kept = new Set(saved.map((row) => row.id));
  const removed = [...owned].filter((id) => !kept.has(id));

  // Delete first: a removed row may hold a unique value (technology name)
  // that a kept row now takes.
  if (removed.length) {
    const { error } = await from().delete().in("id", removed);
    if (error) return null;
  }
  if (saved.length) {
    const { error } = await from().upsert(saved as TablesInsert<"skills">[]);
    if (error) return null;
  }
  return saved.map((row) => row.id);
}
