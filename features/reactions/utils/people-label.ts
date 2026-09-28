import { REACTION_COPY, REACTION_LIMITS } from "../constants";
import type { ReactionPeople } from "../types";

/** "Grace, Minh và 10 người khác" for the tooltip. */
export function peopleLabel({ names, total }: ReactionPeople): string {
  const shown = names.slice(0, REACTION_LIMITS.peopleNames);
  return REACTION_COPY.people(shown, Math.max(0, total - shown.length));
}
