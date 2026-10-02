"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { CATEGORY_COLOR_SWATCHES } from "../../../constants";

type ColorSwatchPickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

/** Preset swatches plus a #RRGGBB input for any other colour. */
export function ColorSwatchPicker({ id, label, value, onChange }: ColorSwatchPickerProps) {
  const current = value.toLowerCase();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-1 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface-sunken px-2.5 py-2"
      >
        {CATEGORY_COLOR_SWATCHES.map((swatch) => {
          const checked = current === swatch;
          return (
            <button
              key={swatch}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={swatch}
              onClick={() => onChange(swatch)}
              className={cn(
                "grid size-6 place-items-center rounded-full transition hover:scale-110",
                checked && "ring-2 ring-text ring-offset-2 ring-offset-surface-sunken",
              )}
              style={{ background: swatch }}
            >
              {checked && <Check aria-hidden className="size-3.5 text-canvas" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
      <input
        id={id}
        aria-label={`${label} (hex)`}
        value={value}
        placeholder={CATEGORY_COLOR_SWATCHES[0]}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="w-28 rounded-md border border-border bg-surface-sunken px-3 py-2.5 text-center font-mono text-sm placeholder:text-faint focus:border-accent focus:outline-none"
      />
    </div>
  );
}
