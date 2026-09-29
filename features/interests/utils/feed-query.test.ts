import { describe, expect, it } from "vitest";

import { EMPTY_FEED_INTERESTS } from "../constants";
import { buildFeedQuery, parseFeedQuery } from "./feed-query";

describe("feed query", () => {
  it("round-trips guest interests and the page", () => {
    const interests = { ...EMPTY_FEED_INTERESTS, categories: ["frontend"], mutedTags: ["queue"] };
    const parsed = parseFeedQuery(new URLSearchParams(buildFeedQuery(2, interests)));
    expect(parsed).toEqual({ page: 2, interests });
  });

  it("sends nothing for signed-in users", () => {
    expect(buildFeedQuery(0, null)).toBe("");
    expect(parseFeedQuery(new URLSearchParams(""))).toEqual({ page: 0, interests: null });
  });

  it("drops malformed interests instead of trusting them", () => {
    expect(parseFeedQuery(new URLSearchParams("c=%3Cscript%3E")).interests).toEqual(EMPTY_FEED_INTERESTS);
  });
});
