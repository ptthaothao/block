"use client";

import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils/cn";

import { REACTION_COPY, REACTIONS } from "../constants";
import type { ReactionKind } from "../types";

type ReactionPickerProps = {
  mine: ReactionKind | undefined;
  onSelect: (kind: ReactionKind) => void;
  onEscape: () => void;
};

/** The emoji row that pops above a comment's Like button. */
export function ReactionPicker({ mine, onSelect, onEscape }: ReactionPickerProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onEscape();
      return;
    }
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    options[(index + step + options.length) % options.length]?.focus();
  };

  return (
    // The wrapper keeps the popover attached to the button so the pointer never crosses a gap.
    <div className="absolute bottom-full left-0 z-20 pb-1.5">
      <div
        role="group"
        aria-label={REACTION_COPY.pickerLabel}
        onKeyDown={onKeyDown}
        className="flex gap-0.5 rounded-full border border-border-strong bg-surface p-1 shadow-popover motion-safe:animate-[reaction-picker-in_150ms_ease-out]"
      >
        {REACTIONS.map((r) => (
          <button
            key={r.kind}
            type="button"
            aria-label={r.label}
            aria-pressed={mine === r.kind}
            title={r.label}
            onClick={() => onSelect(r.kind)}
            className={cn(
              "grid size-10 place-items-center rounded-full text-2xl transition motion-safe:hover:scale-125 motion-safe:focus-visible:scale-125",
              mine === r.kind && "bg-surface-hover",
            )}
          >
            <span aria-hidden>{r.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
