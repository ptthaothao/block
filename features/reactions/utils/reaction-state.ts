import { REACTIONS } from "../constants";
import type { ReactionCounts, ReactionKind, ReactionState } from "../types";

/**
 * The state after the current reader toggles one emoji (used for optimistic updates).
 * A reader has at most one reaction: picking another emoji replaces it, picking it again removes it.
 */
export function applyToggle(state: ReactionState, emoji: ReactionKind): ReactionState {
  const counts: ReactionCounts = { ...state.counts };
  const bump = (kind: ReactionKind, delta: number) => {
    const count = (counts[kind] ?? 0) + delta;
    if (count > 0) counts[kind] = count;
    else delete counts[kind];
  };
  for (const kind of state.mine) bump(kind, -1);
  if (state.mine.includes(emoji)) return { counts, mine: [] };
  bump(emoji, 1);
  return { counts, mine: [emoji] };
}

export function totalReactions(counts: ReactionCounts): number {
  return Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);
}

/** Emoji that at least one reader picked, in display order. */
export function usedReactions(counts: ReactionCounts) {
  return REACTIONS.filter((r) => (counts[r.kind] ?? 0) > 0);
}

export function reactionMeta(kind: ReactionKind) {
  return REACTIONS.find((r) => r.kind === kind) ?? REACTIONS[0];
}

/** Emoji with at least one reader, most picked first (ties keep display order). */
export function rankedReactions(counts: ReactionCounts) {
  return usedReactions(counts)
    .map((r) => ({ ...r, count: counts[r.kind] ?? 0 }))
    .sort((a, b) => b.count - a.count);
}
