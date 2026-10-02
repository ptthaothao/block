"use client";

import { CheckCheck, GitMerge, Trash2, X } from "lucide-react";

import { TAXONOMY_COPY } from "../../../constants";

type TagBulkBarProps = {
  count: number;
  disabled: boolean;
  onApprove: () => void;
  onMerge: () => void;
  onDelete: () => void;
  onClear: () => void;
};

const ACTION_CLASS =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs transition disabled:pointer-events-none disabled:opacity-50";

/** Floating bar with actions for the selected tags. */
export function TagBulkBar({ count, disabled, onApprove, onMerge, onDelete, onClear }: TagBulkBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={TAXONOMY_COPY.tags.selected(count)}
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-border-strong bg-surface-sunken/95 px-4 py-2.5 shadow-popover backdrop-blur sm:rounded-full motion-safe:animate-[sheet-in_200ms_ease-out]"
    >
      <span className="flex items-center gap-2 pr-1 font-mono text-xs text-text">
        <span aria-hidden className="size-2 rounded-full bg-accent" />
        {TAXONOMY_COPY.tags.selected(count)}
      </span>
      <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />
      <button type="button" disabled={disabled} onClick={onApprove} className={`${ACTION_CLASS} bg-emerald/10 text-emerald hover:bg-emerald/20`}>
        <CheckCheck aria-hidden className="size-4" />
        {TAXONOMY_COPY.tags.approveAll}
      </button>
      <button type="button" disabled={disabled} onClick={onMerge} className={`${ACTION_CLASS} bg-surface text-text hover:bg-surface-hover`}>
        <GitMerge aria-hidden className="size-4" />
        {TAXONOMY_COPY.tags.mergeInto}
      </button>
      <button type="button" disabled={disabled} onClick={onDelete} className={`${ACTION_CLASS} bg-danger/10 text-danger hover:bg-danger/20`}>
        <Trash2 aria-hidden className="size-4" />
        {TAXONOMY_COPY.delete}
      </button>
      <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />
      <button
        type="button"
        onClick={onClear}
        aria-label={TAXONOMY_COPY.tags.clearSelection}
        className="grid size-7 place-items-center rounded-full text-muted transition hover:bg-surface-hover hover:text-text"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
