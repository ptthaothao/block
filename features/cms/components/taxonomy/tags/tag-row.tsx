"use client";

import { Check, GitMerge, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Menu } from "@/components/ui/menu";
import { cn } from "@/lib/utils/cn";

import { TAG_STATUS_META, TAXONOMY_COPY } from "../../../constants";
import type { CmsTag } from "../../../types";

type TagRowProps = {
  tag: CmsTag;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  /** Largest post count in the list; the usage bar is relative to it. */
  maxPosts: number;
  disabled: boolean;
  onApprove: () => void;
  onRename: () => void;
  onMerge: () => void;
  onDelete: () => void;
};

export function TagRow({ tag, selected, onSelectedChange, maxPosts, disabled, onApprove, onRename, onMerge, onDelete }: TagRowProps) {
  const pending = tag.status === "pending";
  const { label, className, dotClassName } = TAG_STATUS_META[tag.status];
  const usage = maxPosts > 0 ? (tag.postCount / maxPosts) * 100 : 0;

  return (
    <tr className={cn("group border-b border-border last:border-0 transition-colors", selected ? "bg-accent/[0.06]" : "hover:bg-surface-hover/40")}>
      <td className={cn("w-12 border-l-2 py-3 pl-4", pending ? "border-warning" : "border-transparent")}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectedChange(e.target.checked)}
          aria-label={TAXONOMY_COPY.tags.select(tag.name)}
          className="size-4 rounded accent-accent"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("font-display text-base font-semibold", selected && "text-accent")}>#{tag.name}</span>
          <span className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[11px] text-muted ring-1 ring-border">{tag.slug}</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <Badge className={cn("inline-flex items-center gap-1.5", className)}>
          <span aria-hidden className={cn("size-1.5 rounded-full", dotClassName)} />
          {label}
        </Badge>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-3">
          <span aria-hidden className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-surface-sunken sm:block">
            <span className={cn("block h-full rounded-full", pending ? "bg-warning" : "bg-accent")} style={{ width: `${usage}%` }} />
          </span>
          <span className="w-8 text-right font-mono text-sm tabular-nums">{tag.postCount}</span>
        </div>
      </td>
      <td className="py-3 pr-4 pl-3">
        <div className="flex items-center justify-end gap-1.5">
          {pending && (
            <button
              type="button"
              disabled={disabled}
              onClick={onApprove}
              className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-2.5 py-1 font-mono text-xs text-emerald ring-1 ring-emerald/25 transition hover:bg-emerald/20 disabled:opacity-50"
            >
              <Check aria-hidden className="size-3.5" />
              {TAXONOMY_COPY.tags.approve}
            </button>
          )}
          <Menu
            label={TAXONOMY_COPY.tags.actions(tag.name)}
            items={[
              { id: "rename", label: TAXONOMY_COPY.tags.rename, icon: <Pencil className="size-4" />, onSelect: onRename },
              { id: "merge", label: TAXONOMY_COPY.tags.merge, icon: <GitMerge className="size-4" />, onSelect: onMerge },
              { id: "delete", label: TAXONOMY_COPY.tags.remove, icon: <Trash2 className="size-4 text-danger" />, onSelect: onDelete },
            ]}
          />
        </div>
      </td>
    </tr>
  );
}
