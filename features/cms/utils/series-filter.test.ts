import { describe, expect, it } from "vitest";

import type { CmsSeries } from "../types";
import { filterSeries } from "./series-filter";

const series = (id: number, title: string, description: string | null): CmsSeries => ({
  id,
  title,
  slug: title.toLowerCase().replace(/\s+/g, "-"),
  description,
  coverUrl: null,
  postCount: 0,
});

const all = [series(1, "Laravel A-Z", "Eloquent ORM"), series(2, "Vue 3", null)];

describe("filterSeries", () => {
  it("matches title, slug or description", () => {
    expect(filterSeries(all, "eloquent").map((s) => s.id)).toEqual([1]);
    expect(filterSeries(all, "VUE").map((s) => s.id)).toEqual([2]);
    expect(filterSeries(all, " ")).toBe(all);
  });
});
