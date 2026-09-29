"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils/cn";

import { FILTER_COPY } from "../../constants";

type FilterGroupProps<T> = {
  title: string;
  items: T[];
  /** Items shown before "Xem tất cả"; selected items are always shown. */
  collapsedCount?: number;
  isSelected?: (item: T) => boolean;
  /** Adds a search box that filters by this text. */
  searchText?: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  itemKey: (item: T) => string;
};

export function FilterGroup<T>({
  title,
  items,
  collapsedCount,
  isSelected,
  searchText,
  renderItem,
  itemKey,
}: FilterGroupProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();

  const needle = query.trim().toLowerCase();
  const matching = needle && searchText ? items.filter((item) => searchText(item).toLowerCase().includes(needle)) : items;
  const collapsible = collapsedCount !== undefined && matching.length > collapsedCount && !needle;
  const visible =
    collapsible && !expanded
      ? matching.filter((item, i) => i < collapsedCount || isSelected?.(item))
      : matching;

  if (items.length === 0) return null;

  return (
    <section className="border-b border-border pb-5">
      <Eyebrow className="mb-2">{title}</Eyebrow>
      {searchText && items.length > (collapsedCount ?? 0) && (
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={FILTER_COPY.searchTags}
          aria-label={FILTER_COPY.searchTags}
          aria-controls={listId}
          className="mb-2 w-full rounded-md border border-border bg-surface-sunken px-3 py-2 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
        />
      )}
      <ul id={listId} className="space-y-0.5">
        {visible.map((item) => (
          <li key={itemKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      {needle && matching.length === 0 && <p className="px-2 py-2 text-sm text-faint">{FILTER_COPY.noTagMatch}</p>}
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-1 flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-accent transition hover:text-accent-hover lg:min-h-9"
        >
          {expanded ? FILTER_COPY.showLess : FILTER_COPY.showAll(matching.length)}
          <ChevronDown className={cn("size-4 transition", expanded && "rotate-180")} aria-hidden />
        </button>
      )}
    </section>
  );
}
