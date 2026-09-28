import { ROUTES } from "@/config/routes";

import { POST_ANCHORS } from "../constants";

/** Where signing in from a reaction widget comes back to. */
export function reactionReturnPath(slug: string): string {
  return `${ROUTES.post(slug)}#${POST_ANCHORS.reactions}`;
}
