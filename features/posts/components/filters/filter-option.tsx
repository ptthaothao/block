import type { ReactNode } from "react";

import { CheckboxMark } from "@/components/ui/checkbox-mark";
import { cn } from "@/lib/utils/cn";

import { FILTER_COPY } from "../../constants";
import { FilterLink } from "./filter-link";

type FilterOptionProps = {
  href: string;
  label: string;
  count?: number;
  checked: boolean;
  round?: boolean;
  indent?: boolean;
  /** Shown between the checkbox and the label, e.g. an avatar. */
  leading?: ReactNode;
  onSelect?: () => void;
};

export function FilterOption({ href, label, count, checked, round, indent, leading, onSelect }: FilterOptionProps) {
  return (
    <FilterLink
      href={href}
      onClick={onSelect}
      aria-current={checked ? "true" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-2 text-sm transition hover:bg-surface-hover lg:min-h-9",
        indent && "pl-8",
        checked ? "text-text" : "text-muted hover:text-text",
      )}
    >
      <CheckboxMark checked={checked} round={round} />
      {leading}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {checked && <span className="sr-only">{FILTER_COPY.selected}</span>}
      {count !== undefined && <span className="font-mono text-xs text-faint tabular-nums">{count}</span>}
    </FilterLink>
  );
}
