import { pickKnown, toCountMap } from "@/lib/utils/count-map";
import type { Json } from "@/types/database";

import { REACTION_KINDS } from "./constants";
import type { ReactionCounts, ReactionKind } from "./types";

export function toReactionCounts(value: Json | null | undefined): ReactionCounts {
  return toCountMap(value, REACTION_KINDS);
}

export function toReactionKinds(values: readonly string[] | null | undefined): ReactionKind[] {
  return pickKnown(values, REACTION_KINDS);
}
