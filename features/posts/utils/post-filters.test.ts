import { describe, expect, it } from "vitest";

import { EMPTY_POST_FILTERS } from "../constants";
import {
  buildFilterHref,
  countActiveFilters,
  filterChanges,
  parsePage,
  parsePostFilters,
  postFiltersKey,
} from "./post-filters";

describe("parsePage", () => {
  it("reads 1-based pages and falls back to the first page", () => {
    expect(parsePage("3")).toBe(2);
    expect(parsePage("1")).toBe(0);
    expect(parsePage("abc")).toBe(0);
    expect(parsePage(["2", "5"])).toBe(1);
    expect(parsePage(undefined)).toBe(0);
  });
});

describe("parsePostFilters", () => {
  it("reads every filter", () => {
    expect(
      parsePostFilters({ topic: "Frontend", tag: ["react", "nextjs", "react"], level: ["advanced", "beginner"], author: "hainam", page: "2" }),
    ).toEqual({ topic: "frontend", tags: ["nextjs", "react"], levels: ["beginner", "advanced"], author: "hainam", page: 1 });
  });

  it("drops malformed values", () => {
    expect(parsePostFilters({ topic: "../etc", tag: ["<script>"], level: "expert", author: "" })).toEqual(EMPTY_POST_FILTERS);
  });
});

describe("buildFilterHref", () => {
  it("leaves defaults out", () => {
    expect(buildFilterHref("/posts", EMPTY_POST_FILTERS)).toBe("/posts");
  });

  it("round-trips through parsePostFilters", () => {
    const filters = { topic: "backend", tags: ["a", "b"], levels: ["beginner" as const], author: "x", page: 2 };
    const href = buildFilterHref("/posts", filters);
    const params = Object.fromEntries(
      [...new URLSearchParams(href.split("?")[1]).keys()].map((k) => [k, new URLSearchParams(href.split("?")[1]).getAll(k)]),
    );
    expect(parsePostFilters(params)).toEqual(filters);
  });
});

describe("filterChanges", () => {
  const base = { ...EMPTY_POST_FILTERS, page: 3 };

  it("toggles values and resets the page", () => {
    const withTag = filterChanges.tag(base, "react");
    expect(withTag).toMatchObject({ tags: ["react"], page: 0 });
    expect(filterChanges.tag(withTag, "react").tags).toEqual([]);
    expect(filterChanges.topic(base, "frontend").topic).toBe("frontend");
    expect(filterChanges.topic({ ...base, topic: "frontend" }, "frontend").topic).toBeNull();
    expect(filterChanges.level(filterChanges.level(base, "advanced"), "beginner").levels).toEqual(["beginner", "advanced"]);
  });

  it("keeps filters when paging", () => {
    expect(filterChanges.page({ ...base, tags: ["a"] }, 1)).toMatchObject({ tags: ["a"], page: 1 });
  });
});

describe("countActiveFilters / postFiltersKey", () => {
  it("counts and keys filters", () => {
    const filters = { topic: "a", tags: ["b", "c"], levels: [], author: "d", page: 0 };
    expect(countActiveFilters(filters)).toBe(4);
    expect(postFiltersKey(filters)).not.toBe(postFiltersKey({ ...filters, page: 1 }));
  });
});
