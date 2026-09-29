import { reactionsApi } from "../api";
import { REACTION_QUERY_KEYS } from "../constants";
import type { PeopleSource, ReactionKind } from "../types";

/** Where the tooltip loads names from for an emoji on a post. */
export function postPeopleSource(slug: string, kind: ReactionKind): PeopleSource {
  return {
    queryKey: REACTION_QUERY_KEYS.people(`post:${slug}`, kind),
    fetch: () => reactionsApi.postPeople(slug, kind),
  };
}
