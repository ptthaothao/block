import { REACTIONS } from "../constants";
import type { ReactionCounts, ReactionKind, ReactionState } from "../types";

/** The state after the current reader toggles one emoji (used for optimistic updates). */
export function applyToggle(state: ReactionState, emoji: ReactionKind): ReactionState {
  const had = state.mine.includes(emoji);
  const count = (state.counts[emoji] ?? 0) + (had ? -1 : 1);
  const counts: ReactionCounts = { ...state.counts };
  if (count > 0) counts[emoji] = count;
  else delete counts[emoji];
  return { counts, mine: had ? state.mine.filter((e) => e !== emoji) : [...state.mine, emoji] };
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
