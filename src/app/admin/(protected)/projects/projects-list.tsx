"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FormFooter, type FormStatus } from "@/components/admin/form-footer";
import { ListControls } from "@/components/admin/list-controls";
import { reorderProjects } from "@/lib/actions/projects";
import type { ProjectListItem } from "@/lib/data/admin";
import { roman } from "@/lib/format/roman";

/** Projects in chart order, reordered with ↑ / ↓ then saved (F-ADM-15). */
export function ProjectsList({ projects }: { projects: ProjectListItem[] }) {
  const t = useTranslations("admin.projects");
  const [items, setItems] = useState(projects);
  const [saved, setSaved] = useState(projects);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pending, startTransition] = useTransition();
  const dirty = items.some((item, i) => item.id !== saved[i]?.id);

  function move(from: number, to: number) {
    setItems((list) => {
      const next = [...list];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await reorderProjects(items.map((item) => item.id));
      if (result.ok) setSaved(items);
      setStatus(
        result.ok ? "saved" : result.error === "failed" ? "failed" : "invalid",
      );
    });
  }

  if (!items.length) return <p className="todo">{t("empty")}</p>;

  // Published projects are numbered as on the chart; drafts get no numeral.
  const numerals = items.reduce<(string | null)[]>((acc, item) => {
    const n = acc.filter(Boolean).length + 1;
    return [...acc, item.status === "published" ? roman(n) : null];
  }, []);

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-1 border-t border-border pt-6">
        <h2 className="kicker">{t("orderHeading")}</h2>
        <p className="text-sm text-muted-foreground">{t("orderHint")}</p>
      </div>
      <ol className="grid">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-border py-3"
          >
            <span className="mono text-or-clair">{numerals[index] ?? "—"}</span>
            <div className="grid min-w-0 gap-1">
              <Link
                href={`/admin/projects/${item.id}`}
                className="truncate underline-offset-4 hover:text-or-clair hover:underline"
              >
                {item.title || t("untitled")}
              </Link>
              <p className="mono flex flex-wrap gap-x-4 text-muted-foreground">
                <span>{t(`status.${item.status}`)}</span>
                <span>{item.layout}</span>
                <span className="truncate">/{item.slug}</span>
                {item.missing > 0 && (
                  <span className="text-todo">
                    {t("missingShort", { count: item.missing })}
                  </span>
                )}
              </p>
            </div>
            <ListControls
              index={index}
              count={items.length}
              onMove={move}
              itemLabel={item.title || t("item", { n: index + 1 })}
            />
          </li>
        ))}
      </ol>
      <FormFooter status={status} pending={pending} dirty={dirty} />
    </form>
  );
}
