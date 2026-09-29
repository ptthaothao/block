import { API_ROUTES } from "@/config/routes";
import { getJson } from "@/lib/http/get-json";

import type { FeedInterests, FeedPage, InterestsResponse } from "./types";
import { buildFeedQuery } from "./utils/feed-query";

/** Browser-side reads from our own API (BFF). */
export const interestsApi = {
  mine: () => getJson<InterestsResponse>(API_ROUTES.interests),
  feed: (page: number, guestInterests: FeedInterests | null) => {
    const query = buildFeedQuery(page, guestInterests);
    return getJson<FeedPage>(query ? `${API_ROUTES.feed}?${query}` : API_ROUTES.feed);
  },
};
