"use client";

import { ChevronDown, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import type { ComponentProps } from "react";

import { ColorDot } from "@/components/ui/color-dot";
import { IconButton } from "@/components/ui/icon-button";
import { TopicIconTile } from "@/features/topics/components/topic-icon-tile";
import { cn } from "@/lib/utils/cn";

import { TAXONOMY_COPY } from "../../../constants";
import type { CmsCategory } from "../../../types";

type CategoryRowProps = {
  category: CmsCategory;
  /** Parents show their children's posts too. */
  postCount: number;
  selected: boolean;
  disabled: boolean;
  /** Spread on the <tr> (drop target). */
  rowProps: ComponentProps<"tr">;
  /** Spread on the drag handle; omitted while dragging is off (e.g. during a search). */
  handleProps?: ComponentProps<"button">;
  dragging: boolean;
  dropTarget: boolean;
  onEdit: () => void;
  onDelete: () => void;
} & (
  | { depth: 0; childCount: number; expanded: boolean; onToggle: () => void; onAddChild: () => void }
  | { depth: 1 }
);

/** One category in the tree table: a parent (icon tile, child count, expand) or an indented child. */
export function CategoryRow(props: CategoryRowProps) {
  const { category, postCount, selected, disabled, rowProps, handleProps, dragging, dropTarget, onEdit, onDelete } = props;
  const isParent = props.depth === 0;

  return (
    <tr
      {...rowProps}
      className={cn(
        "group transition-colors",
        selected ? "bg-accent/[0.07]" : "hover:bg-surface-hover/50",
        dragging && "opacity-40",
        dropTarget && "outline-2 -outline-offset-2 outline-accent/60 outline-dashed",
      )}
    >
      <td className={cn("relative py-2.5 pr-3", isParent ? "pl-4 sm:pl-5" : "pl-12 sm:pl-13")}>
        {selected && <span aria-hidden className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-accent" />}
        {!isParent && <span aria-hidden className="absolute inset-y-0 left-[1.6rem] w-px sm:left-[1.85rem] bg-border" />}
        <div className="flex items-center gap-2">
          {isParent && (
            <button
              type="button"
              aria-expanded={props.expanded}
              aria-label={TAXONOMY_COPY.categories.expand(category.name)}
              onClick={props.onToggle}
              disabled={props.childCount === 0}
              className="grid size-6 place-items-center rounded text-faint transition hover:text-text disabled:invisible"
            >
              <ChevronDown aria-hidden className={cn("size-4 transition-transform", !props.expanded && "-rotate-90")} />
            </button>
          )}
          {handleProps && (
            <button
              type="button"
              aria-label={TAXONOMY_COPY.categories.reorder(category.name)}
              className="grid size-6 cursor-grab place-items-center rounded text-faint/70 transition hover:text-text active:cursor-grabbing"
              {...handleProps}
            >
              <GripVertical aria-hidden className="size-4" />
            </button>
          )}
          {isParent ? (
            <TopicIconTile icon={category.icon} color={category.color} className="size-8 rounded-md [&>svg]:size-4" />
          ) : (
            <ColorDot color={category.color} size="md" />
          )}
          <span className={cn("truncate", isParent ? "font-display font-semibold" : "text-sm")}>{category.name}</span>
          {isParent && props.childCount > 0 && (
            <span className="shrink-0 rounded-full bg-surface-sunken px-2 py-0.5 font-mono text-[11px] text-muted ring-1 ring-border">
              {TAXONOMY_COPY.categories.childCount(props.childCount)}
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5 font-mono text-xs text-muted">{category.slug}</td>
      <td className={cn("px-3 py-2.5 text-right font-mono tabular-nums", isParent ? "text-sm text-text" : "text-xs text-muted")}>
        {postCount}
      </td>
      <td className="py-2.5 pr-4 pl-2 sm:pr-5">
        <div
          className={cn(
            "flex justify-end gap-0.5 transition-opacity",
            !selected && "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
          )}
        >
          {isParent && (
            <IconButton label={TAXONOMY_COPY.categories.addChild(category.name)} tone="accent" disabled={disabled} onClick={props.onAddChild}>
              <Plus aria-hidden className="size-4" />
            </IconButton>
          )}
          <IconButton label={`${TAXONOMY_COPY.categories.editTitle} ${category.name}`} tone="accent" disabled={disabled} onClick={onEdit}>
            <Pencil aria-hidden className="size-4" />
          </IconButton>
          <IconButton label={`${TAXONOMY_COPY.delete} ${category.name}`} tone="danger" disabled={disabled} onClick={onDelete}>
            <Trash2 aria-hidden className="size-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}
