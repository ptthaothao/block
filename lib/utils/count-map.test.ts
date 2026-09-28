import { describe, expect, it } from "vitest";

import { pickKnown, toCountMap } from "./count-map";

describe("count map", () => {
  it("keeps known keys with positive whole counts", () => {
    expect(toCountMap({ a: 2, b: 0, c: 3, d: 1.5 }, ["a", "b", "d"])).toEqual({ a: 2 });
    expect(toCountMap(null, ["a"])).toEqual({});
    expect(toCountMap([1], ["a"])).toEqual({});
  });

  it("picks known values", () => {
    expect(pickKnown(["a", "z"], ["a", "b"])).toEqual(["a"]);
    expect(pickKnown(null, ["a"])).toEqual([]);
  });
});
