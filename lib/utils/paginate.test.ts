import { describe, expect, it } from "vitest";

import { paginate } from "./paginate";

const items = Array.from({ length: 24 }, (_, i) => i + 1);

describe("paginate", () => {
  it("slices a page and reports its range", () => {
    const page = paginate(items, 3, 10);
    expect(page.items).toEqual([21, 22, 23, 24]);
    expect(page).toMatchObject({ page: 3, pageCount: 3, from: 21, to: 24, total: 24 });
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 9, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
  });

  it("handles an empty list", () => {
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, pageCount: 1, from: 0, to: 0, total: 0 });
  });
});
