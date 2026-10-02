import { describe, expect, it } from "vitest";

import { moveItem } from "./move-item";

describe("moveItem", () => {
  it("moves an item down or up to the target's slot", () => {
    expect(moveItem([1, 2, 3, 4], 1, 3)).toEqual([2, 3, 1, 4]);
    expect(moveItem([1, 2, 3, 4], 4, 2)).toEqual([1, 4, 2, 3]);
  });

  it("returns a copy when nothing moves", () => {
    const items = [1, 2];
    expect(moveItem(items, 1, 1)).toEqual([1, 2]);
    expect(moveItem(items, 1, 9)).not.toBe(items);
  });
});
