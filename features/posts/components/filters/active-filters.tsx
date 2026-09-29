import { X } from "lucide-react";

import { FILTER_COPY } from "../../constants";
import { buildFilterHref } from "../../utils/post-filters";
import type { ActiveFilter } from "../../utils/active-filters";
import { FilterLink } from "./filter-link";

export function ActiveFilters({ basePath, chips }: { basePath: string; chips: ActiveFilter[] }) {
  if (chips.length === 0) return null;
  return (
    <ul className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <FilterLink
            href={buildFilterHref(basePath, chip.without)}
            aria-label={FILTER_COPY.removeFilter(chip.label)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 py-1 pl-3 pr-2 text-sm text-accent transition hover:border-accent"
          >
            {chip.label}
            <X className="size-3.5" aria-hidden />
          </FilterLink>
        </li>
      ))}
      <li>
        <FilterLink href={basePath} className="inline-flex min-h-9 items-center px-2 text-sm text-muted underline-offset-4 transition hover:text-text hover:underline">
          {FILTER_COPY.clear}
        </FilterLink>
      </li>
    </ul>
  );
}
