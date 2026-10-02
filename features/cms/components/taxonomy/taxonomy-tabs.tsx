"use client";

import { cn } from "@/lib/utils/cn";

import { TAXONOMY_COPY, TAXONOMY_TABS, type TaxonomyTab } from "../../constants";

type TaxonomyTabsProps = {
  value: TaxonomyTab;
  onChange: (tab: TaxonomyTab) => void;
  counts: Record<TaxonomyTab, number> | null;
};

/** Categories / Tags / Series, each with how many there are. */
export function TaxonomyTabs({ value, onChange, counts }: TaxonomyTabsProps) {
  return (
    <div role="tablist" aria-label={TAXONOMY_COPY.tabsLabel} className="flex gap-6 overflow-x-auto shadow-[inset_0_-1px_0_var(--border)]">
      {TAXONOMY_TABS.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`taxonomy-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`taxonomy-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 font-display text-base font-semibold whitespace-nowrap transition",
              selected ? "border-accent text-accent" : "border-transparent text-muted hover:text-text",
            )}
          >
            {tab.label}
            {counts && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ring-1",
                  selected ? "bg-accent/15 text-accent ring-accent/30" : "bg-surface text-muted ring-border",
                )}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
