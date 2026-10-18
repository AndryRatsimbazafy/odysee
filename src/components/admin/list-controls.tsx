"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./button";

/** Move up / move down / remove buttons for an ordered list item. */
export function ListControls({
  index,
  count,
  onMove,
  onRemove,
  itemLabel,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  /** Accessible name of the item, e.g. "LinkedIn". */
  itemLabel: string;
}) {
  const t = useTranslations("admin.list");
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={index === 0}
        aria-label={t("up", { item: itemLabel })}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUp aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={index === count - 1}
        aria-label={t("down", { item: itemLabel })}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDown aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("remove", { item: itemLabel })}
        onClick={() => onRemove(index)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
