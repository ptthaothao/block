import { EMPTY_FEED_INTERESTS, FEED_QUERY_PARAMS } from "../constants";
import { feedInterestsSchema } from "../schemas";
import type { FeedInterests } from "../types";

const LIST_KEYS = ["categories", "tags", "authors", "mutedCategories", "mutedTags"] as const satisfies readonly (keyof FeedInterests)[];

/** Query string for /api/feed. Guest interests travel in the URL; signed-in users send none. */
export function buildFeedQuery(page: number, interests: FeedInterests | null): string {
  const params = new URLSearchParams();
  if (page > 0) params.set(FEED_QUERY_PARAMS.page, String(page));
  if (interests) {
    for (const key of LIST_KEYS) {
      for (const slug of interests[key]) params.append(FEED_QUERY_PARAMS[key], slug);
    }
  }
  return params.toString();
}

/** Read guest interests from /api/feed's query string; null when none were sent or they are malformed. */
export function parseFeedQuery(params: URLSearchParams): { page: number; interests: FeedInterests | null } {
  const pageValue = Number(params.get(FEED_QUERY_PARAMS.page));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 0;
  const raw = Object.fromEntries(LIST_KEYS.map((key) => [key, params.getAll(FEED_QUERY_PARAMS[key])]));
  const sent = LIST_KEYS.some((key) => raw[key].length > 0);
  if (!sent) return { page, interests: null };
  const parsed = feedInterestsSchema.safeParse(raw);
  return { page, interests: parsed.success ? parsed.data : EMPTY_FEED_INTERESTS };
}
