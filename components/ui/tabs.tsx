"use client";

import { cn } from "@/lib/utils/cn";

type Tab<T extends string> = { id: T; label: string };

type TabsProps<T extends string> = {
  tabs: readonly Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

export function Tabs<T extends string>({ tabs, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap gap-1 border-b border-border", className)}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
              selected ? "border-accent text-text" : "border-transparent text-muted hover:text-text",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
