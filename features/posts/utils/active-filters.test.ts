import { describe, expect, it } from "vitest";

import { EMPTY_POST_FILTERS } from "../constants";
import { listActiveFilters } from "./active-filters";

const lookups = {
  topics: [{ slug: "frontend", name: "Frontend", description: null, icon: null, color: null, postCount: 2, children: [{ slug: "react", name: "React", postCount: 1 }] }],
  tags: [{ slug: "nextjs", name: "nextjs", postCount: 1 }],
  authors: [{ username: "hainam", displayName: "Nguyễn Hải Nam", avatarUrl: null, postCount: 2 }],
};

describe("listActiveFilters", () => {
  it("labels each filter and removes only that one", () => {
    const filters = { ...EMPTY_POST_FILTERS, topic: "react", tags: ["nextjs"], author: "hainam", levels: ["beginner" as const] };
    const chips = listActiveFilters(filters, lookups);
    expect(chips.map((c) => c.label)).toEqual(["Frontend › React", "#nextjs", "Nguyễn Hải Nam", "Cơ bản"]);
    expect(chips[1].without).toMatchObject({ topic: "react", tags: [], author: "hainam" });
  });

  it("falls back to the slug for unknown values", () => {
    expect(listActiveFilters({ ...EMPTY_POST_FILTERS, tags: ["ghost"] }, lookups)[0].label).toBe("#ghost");
  });
});
