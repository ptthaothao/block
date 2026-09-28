"use client";

import { cn } from "@/lib/utils/cn";

import { REACTION_COPY } from "../constants";
import type { ReactionKind } from "../types";
import { reactionMeta } from "../utils/reaction-state";
import type { PeopleSource } from "../types";
import { ReactionPeopleTooltip } from "./reaction-people-tooltip";

const VARIANTS = {
  /** Desktop rail: emoji over count. */
  rail: "size-12 flex-col gap-0.5 rounded-xl text-[11px]",
  /** End of article: big, with the label. */
  bar: "min-h-12 gap-2 rounded-full px-4 text-sm",
  /** Comments and the mobile picker: small pill. */
  chip: "min-h-9 gap-1.5 rounded-full px-3 text-xs",
} as const;

const EMOJI_SIZES = { rail: "text-xl", bar: "text-xl", chip: "text-base" } as const;

type ReactionButtonProps = {
  kind: ReactionKind;
  count: number;
  mine: boolean;
  popped: boolean;
  onToggle: (kind: ReactionKind) => void;
  variant: keyof typeof VARIANTS;
  showLabel?: boolean;
  people?: PeopleSource | null;
  tooltipSide?: "top" | "right";
};

export function ReactionButton({
  kind,
  count,
  mine,
  popped,
  onToggle,
  variant,
  showLabel = false,
  people = null,
  tooltipSide,
}: ReactionButtonProps) {
  const meta = reactionMeta(kind);
  return (
    <ReactionPeopleTooltip source={count > 0 ? people : null} side={tooltipSide}>
      {(describedBy) => (
        <button
          type="button"
          aria-pressed={mine}
          aria-label={REACTION_COPY.buttonLabel(meta.label, count, mine)}
          aria-describedby={describedBy}
          onClick={() => onToggle(kind)}
          className={cn(
            "inline-flex items-center justify-center border font-medium tabular-nums transition select-none",
            mine
              ? "border-accent/60 bg-accent/15 text-accent ring-1 ring-accent/30"
              : "border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-hover hover:text-text",
            VARIANTS[variant],
          )}
        >
          <span
            aria-hidden
            className={cn(EMOJI_SIZES[variant], popped && "motion-safe:animate-[reaction-pop_150ms_ease-out]")}
          >
            {meta.emoji}
          </span>
          {showLabel && <span>{meta.label}</span>}
          {(count > 0 || variant === "rail") && <span aria-hidden>{count}</span>}
        </button>
      )}
    </ReactionPeopleTooltip>
  );
}
