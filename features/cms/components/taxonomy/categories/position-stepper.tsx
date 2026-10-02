"use client";

import { Minus, Plus } from "lucide-react";

import { clamp } from "@/lib/utils/clamp";

import { TAXONOMY_COPY } from "../../../constants";

type PositionStepperProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

/** Number input with − / + buttons. */
export function PositionStepper({ id, value, min, max, onChange }: PositionStepperProps) {
  const set = (next: number) => onChange(clamp(Number.isFinite(next) ? Math.trunc(next) : min, min, max));
  return (
    <div className="flex h-[42px] items-center overflow-hidden rounded-md border border-border bg-surface-sunken focus-within:border-accent">
      <button
        type="button"
        aria-label={TAXONOMY_COPY.categories.positionDown}
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className="grid h-full w-9 place-items-center text-muted transition hover:text-text disabled:opacity-40"
      >
        <Minus aria-hidden className="size-3.5" />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-center font-mono text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={TAXONOMY_COPY.categories.positionUp}
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className="grid h-full w-9 place-items-center text-muted transition hover:text-text disabled:opacity-40"
      >
        <Plus aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
