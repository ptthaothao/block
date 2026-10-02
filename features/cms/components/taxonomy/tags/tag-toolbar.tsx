"use client";

import { ArrowDownUp, Plus, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import { CMS_LIMITS, TAG_SORT_OPTIONS, TAG_STATUS_FILTERS, TAXONOMY_COLUMNS, TAXONOMY_COPY } from "../../../constants";
import type { TagSort, TagStatusFilter } from "../../../types";

const IDS = { search: "tag-search", sort: "tag-sort", create: "tag-new-name" } as const;

type TagToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: TagStatusFilter;
  onStatusChange: (value: TagStatusFilter) => void;
  counts: Record<TagStatusFilter, number>;
  sort: TagSort;
  onSortChange: (value: TagSort) => void;
  creating: boolean;
  /** Calls `done` once the tag exists, so the input can be cleared. */
  onCreate: (name: string, done: () => void) => void;
};

/** Search, status filter, sort and the quick "new tag" input above the tag table. */
export function TagToolbar(props: TagToolbarProps) {
  const { search, onSearchChange, status, onStatusChange, counts, sort, onSortChange, creating, onCreate } = props;
  const [name, setName] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim()) onCreate(name.trim(), () => setName(""));
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border border-border bg-surface p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor={IDS.search} className="relative w-full max-w-sm">
          <span className="sr-only">{TAXONOMY_COPY.tags.search}</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input
            id={IDS.search}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={TAXONOMY_COPY.tags.search}
            className="w-full rounded-md border border-border bg-surface-sunken py-2 pr-3 pl-9 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>
        <div role="radiogroup" aria-label={TAXONOMY_COLUMNS.tags.status} className="flex flex-wrap gap-1">
          {TAG_STATUS_FILTERS.map((filter) => {
            const checked = filter.id === status;
            return (
              <button
                key={filter.id}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => onStatusChange(filter.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition",
                  checked ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface-hover hover:text-text",
                )}
              >
                {filter.dotClassName && <span aria-hidden className={cn("size-1.5 rounded-full", filter.dotClassName)} />}
                {filter.label}
                <span className="text-faint">{counts[filter.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={IDS.sort} className="relative inline-flex items-center">
          <span className="sr-only">{TAXONOMY_COPY.tags.sort}</span>
          <ArrowDownUp aria-hidden className="pointer-events-none absolute left-3 size-3.5 text-faint" />
          <select
            id={IDS.sort}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as TagSort)}
            className="rounded-md border border-border bg-surface-sunken py-2 pr-8 pl-8 font-mono text-xs focus:border-accent focus:outline-none"
          >
            {TAG_SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {TAXONOMY_COPY.tags.sort}: {option.label}
              </option>
            ))}
          </select>
        </label>
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            id={IDS.create}
            aria-label={TAXONOMY_COPY.tags.newPlaceholder}
            placeholder={TAXONOMY_COPY.tags.newPlaceholder}
            maxLength={CMS_LIMITS.tagNameMax}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-40 rounded-md border border-border bg-surface-sunken px-3 py-2 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <Button type="submit" size="sm" loading={creating} disabled={!name.trim()}>
            <Plus aria-hidden className="size-4" />
            {TAXONOMY_COPY.tags.add}
          </Button>
        </form>
      </div>
    </div>
  );
}
