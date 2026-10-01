"use client";

import { useState, type ReactNode } from "react";

import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { LoginModal } from "@/features/auth/components/login-modal";
import { useToast } from "@/lib/hooks/use-toast";

import { toggleReaction } from "../actions";
import { REACTION_COPY, REACTION_TIMINGS } from "../constants";
import type { ReactionKind, ReactionState } from "../types";
import { applyToggle } from "../utils/reaction-state";
import { LikeButton } from "./like-button";
import { ReactionCluster } from "./reaction-cluster";

type CommentReactionsProps = {
  commentId: string;
  initial: ReactionState;
  /** Where signing in comes back to (the comment's anchor). */
  returnPath: string;
  disabled?: boolean;
  /** Other actions (Reply, time) shown between Like and the reaction cluster. */
  children?: ReactNode;
};

/** A comment's action row: Like with its hover picker, any extra actions, and the grouped reaction cluster. */
export function CommentReactions({ commentId, initial, returnPath, disabled = false, children }: CommentReactionsProps) {
  const user = useSessionUser();
  const toast = useToast();
  const [state, setState] = useState(initial);
  // A refetched comment brings fresh counts; take them.
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setState(initial);
  }
  const [loginOpen, setLoginOpen] = useState(false);
  const [popped, setPopped] = useState<ReactionKind | null>(null);

  const toggle = async (emoji: ReactionKind) => {
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

  const mine = state.mine[0];
  const choose = (emoji: ReactionKind) => {
    if (emoji !== mine) void toggle(emoji);
  };

  return (
    <div role="group" aria-label={REACTION_COPY.groupLabel} className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <LikeButton mine={mine} popped={popped === mine} disabled={disabled} onToggle={toggle} onChoose={choose} />
      {children}
      <ReactionCluster counts={state.counts} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} next={returnPath} reason={REACTION_COPY.loginReason} />
    </div>
  );
}
