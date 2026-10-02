"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label: string;
  prevLabel: string;
  nextLabel: string;
};

const BUTTON_CLASS =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 font-mono text-xs transition disabled:pointer-events-none disabled:opacity-40";

/** Previous / numbered pages / next. Renders nothing for a single page. */
export function Pagination({ page, pageCount, onChange, label, prevLabel, nextLabel }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className={cn(BUTTON_CLASS, "text-muted hover:text-text")}>
        <ChevronLeft aria-hidden className="size-3.5" />
        {prevLabel}
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? "page" : undefined}
          onClick={() => onChange(n)}
          className={cn(
            BUTTON_CLASS,
            n === page ? "bg-accent/15 text-accent ring-1 ring-accent/30" : "text-muted hover:bg-surface-hover hover:text-text",
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={cn(BUTTON_CLASS, "text-muted hover:text-text")}
      >
        {nextLabel}
        <ChevronRight aria-hidden className="size-3.5" />
      </button>
    </nav>
  );
}
