import type { Json } from "@/types/database";

import { REACTION_KINDS } from "./constants";
import type { ReactionCounts, ReactionKind } from "./types";

/** Keep only known emoji with positive whole counts. */
export function toReactionCounts(value: Json | null | undefined): ReactionCounts {
  const counts: ReactionCounts = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return counts;
  for (const kind of REACTION_KINDS) {
    const n = value[kind];
    if (typeof n === "number" && Number.isInteger(n) && n > 0) counts[kind] = n;
  }
  return counts;
}

export function toReactionKinds(values: readonly string[] | null | undefined): ReactionKind[] {
  return (values ?? []).filter((v): v is ReactionKind => (REACTION_KINDS as readonly string[]).includes(v));
}
