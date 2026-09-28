"use client";

import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { LoginModal } from "@/features/auth/components/login-modal";
import { useToast } from "@/lib/hooks/use-toast";

import { toggleReaction } from "../actions";
import { REACTION_COPY, REACTION_TIMINGS, REACTIONS } from "../constants";
import type { ReactionKind, ReactionState } from "../types";
import { applyToggle, usedReactions } from "../utils/reaction-state";
import { ReactionButton } from "./reaction-button";

type CommentReactionsProps = {
  commentId: string;
  initial: ReactionState;
  /** Where signing in comes back to (the comment's anchor). */
  returnPath: string;
  disabled?: boolean;
};

/** Reactions under a comment: only emoji someone picked, plus a "😀+" picker. */
export function CommentReactions({ commentId, initial, returnPath, disabled = false }: CommentReactionsProps) {
  const user = useSessionUser();
  const toast = useToast();
  const [state, setState] = useState(initial);
  // A refetched comment brings fresh counts; take them.
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setState(initial);
  }
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [popped, setPopped] = useState<ReactionKind | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPickerOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPickerOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  const toggle = async (emoji: ReactionKind) => {
    setPickerOpen(false);
    if (user === undefined) return;
    if (user === null) {
      setLoginOpen(true);
      return;
    }
    const previous = state;
    if (!state.mine.includes(emoji)) {
      setPopped(emoji);
      setTimeout(() => setPopped(null), REACTION_TIMINGS.bounceMs);
    }
    setState(applyToggle(state, emoji));
    const result = await toggleReaction({ target: { type: "comment", id: commentId }, emoji });
    if (result.ok) setState(result.data);
    else {
      setState(previous);
      toast.show({ message: result.error, tone: "error" });
    }
  };

  return (
    <div ref={rootRef} role="group" aria-label={REACTION_COPY.groupLabel} className="relative flex flex-wrap items-center gap-1.5">
      {usedReactions(state.counts).map((r) => (
        <ReactionButton
          key={r.kind}
          kind={r.kind}
          count={state.counts[r.kind] ?? 0}
          mine={state.mine.includes(r.kind)}
          popped={popped === r.kind}
          onToggle={toggle}
          variant="chip"
        />
      ))}
      {!disabled && (
        <button
          type="button"
          aria-label={REACTION_COPY.moreReactions}
          aria-expanded={pickerOpen}
          onClick={() => setPickerOpen((open) => !open)}
          className="grid size-9 place-items-center rounded-full text-faint transition hover:bg-surface-hover hover:text-text aria-expanded:bg-surface-hover aria-expanded:text-text"
        >
          <SmilePlus aria-hidden className="size-4" />
        </button>
      )}
      {pickerOpen && (
        <div
          role="group"
          aria-label={REACTION_COPY.pickerLabel}
          className="absolute bottom-full left-0 z-20 mb-2 flex gap-1 rounded-full border border-border-strong bg-surface p-1.5 shadow-popover"
        >
          {REACTIONS.map((r) => (
            <ReactionButton
              key={r.kind}
              kind={r.kind}
              count={state.counts[r.kind] ?? 0}
              mine={state.mine.includes(r.kind)}
              popped={popped === r.kind}
              onToggle={toggle}
              variant="chip"
            />
          ))}
        </div>
      )}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} next={returnPath} reason={REACTION_COPY.loginReason} />
    </div>
  );
}
