"use client";

import type { ReactNode } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useMissingTranslations } from "./bilingual-field";
import { Button } from "./button";
import { FormFooter, type FormStatus } from "./form-footer";
import { ListControls } from "./list-controls";

type OrderedListProps = {
  /** Field array path, e.g. "technologies". */
  name: string;
  /** Visible and accessible name of an item (1-based number given). */
  itemLabel: (index: number, n: number) => string;
  addLabel: string;
  emptyLabel: string;
  /** Values of a new item. */
  newItem: () => Record<string, unknown>;
  max?: number;
  children: (index: number) => ReactNode;
};

/** Ordered list of form items with ↑ / ↓ / remove and an add button. */
export function OrderedList({
  name,
  itemLabel,
  addLabel,
  emptyLabel,
  newItem,
  max,
  children,
}: OrderedListProps) {
  const { control } = useFormContext();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name,
    keyName: "key",
  });

  return (
    <div className="grid gap-8">
      {fields.length === 0 && <p className="todo">{emptyLabel}</p>}
      <ol className="grid gap-8">
        {fields.map((field, index) => {
          const label = itemLabel(index, index + 1);
          return (
            <li
              key={field.key}
              className="grid gap-5 border-t border-border pt-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="kicker min-w-0 truncate">{label}</h3>
                <ListControls
                  index={index}
                  count={fields.length}
                  onMove={move}
                  onRemove={remove}
                  itemLabel={label}
                />
              </div>
              {children(index)}
            </li>
          );
        })}
      </ol>
      <Button
        type="button"
        variant="outline"
        className="justify-self-start"
        disabled={max !== undefined && fields.length >= max}
        onClick={() => append(newItem())}
      >
        {addLabel}
      </Button>
    </div>
  );
}

type ListPairs = { name: string; keys: readonly string[] }[];

/** Save bar counting missing translations across ordered lists (F-ADM-08). */
export function ListFormFooter({
  lists,
  ...props
}: {
  lists: ListPairs;
  status: FormStatus;
  pending: boolean;
  dirty: boolean;
}) {
  const missing = useListMissing(lists);
  return <FormFooter {...props} missing={missing} />;
}

function useListMissing(lists: ListPairs) {
  const { control } = useFormContext();
  const values = useWatch({ control, name: lists.map((list) => list.name) });
  const pairs = lists.flatMap((list, i) =>
    ((values[i] as unknown[] | undefined) ?? []).flatMap((_, index) =>
      list.keys.map(
        (key) =>
          [
            `${list.name}.${index}.${key}_fr`,
            `${list.name}.${index}.${key}_en`,
          ] as [string, string],
      ),
    ),
  );
  return useMissingTranslations(pairs);
}
