import { API_ROUTES } from "@/config/routes";
import { getJson } from "@/lib/http/get-json";

import type { PostReactions, ReactionKind, ReactionPeople } from "./types";

/** Browser-side reads from our own API (BFF). */
export const reactionsApi = {
  post: (slug: string) => getJson<PostReactions>(API_ROUTES.postReactions(slug)),
  postPeople: (slug: string, emoji: ReactionKind) => getJson<ReactionPeople>(API_ROUTES.postReactionPeople(slug, emoji)),
};
