"use client";

import { ThumbsUp } from "lucide-react";
import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils/cn";

import { QUICK_REACTION, REACTION_COPY } from "../constants";
import { useReactionPicker } from "../hooks/use-reaction-picker";
import type { ReactionKind } from "../types";
import { reactionMeta } from "../utils/reaction-state";
import { ReactionPicker } from "./reaction-picker";

type LikeButtonProps = {
  mine: ReactionKind | undefined;
  popped: boolean;
  disabled: boolean;
  /** Set this reaction (or remove it if it is already the reader's pick). */
  onToggle: (kind: ReactionKind) => void;
  /** Switch to this reaction; picking the current one changes nothing. */
  onChoose: (kind: ReactionKind) => void;
};

/**
 * A comment's single "Thích" action. Click toggles; hover-and-hold, long-press or
 * ArrowUp opens the picker for the other emoji.
 */
export function LikeButton({ mine, popped, disabled, onToggle, onChoose }: LikeButtonProps) {
  const picker = useReactionPicker();
  const root = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const meta = mine ? reactionMeta(mine) : null;

  useEffect(() => {
    if (!picker.open) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) picker.hide();
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [picker]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    picker.show();
    // The picker mounts on this render; focus its first option right after.
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('[role="group"] button')?.focus());
  };
  const onBlur = (event: FocusEvent) => {
    if (!root.current?.contains(event.relatedTarget as Node | null)) picker.hide();
  };

  return (
    <span ref={root} className="relative inline-flex" onBlur={onBlur} {...picker.handlers}>
      <button
        ref={button}
        type="button"
        disabled={disabled}
        aria-pressed={Boolean(mine)}
        aria-haspopup="true"
        aria-expanded={picker.open}
        aria-label={meta ? REACTION_COPY.unlikeLabel(meta.label) : REACTION_COPY.likeLabel}
        onKeyDown={onKeyDown}
        onContextMenu={(event) => event.preventDefault()}
        onClick={() => {
          if (picker.consumeLongPress()) return;
          picker.hide();
          onToggle(mine ?? QUICK_REACTION);
        }}
        className={cn(
          "inline-flex min-h-9 select-none items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition [-webkit-touch-callout:none] enabled:hover:bg-surface-hover disabled:opacity-50",
          meta ? meta.tone : "text-muted enabled:hover:text-text",
        )}
      >
        {meta ? (
          <span aria-hidden className={cn("text-base leading-none", popped && "motion-safe:animate-[reaction-pop_150ms_ease-out]")}>
            {meta.emoji}
          </span>
        ) : (
          <ThumbsUp aria-hidden className="size-3.5" />
        )}
        {meta ? meta.label : REACTION_COPY.like}
      </button>
      {picker.open && (
        <ReactionPicker
          mine={mine}
          onSelect={(kind) => {
            picker.hide();
            onChoose(kind);
            button.current?.focus();
          }}
          onEscape={() => {
            picker.hide();
            button.current?.focus();
          }}
        />
      )}
    </span>
  );
}
