import { describe, expect, it } from "vitest";

import { toReactionCounts, toReactionKinds } from "./mappers";

describe("reaction mappers", () => {
  it("keeps known emoji with positive counts", () => {
    expect(toReactionCounts({ helpful: 2, love: 0, bogus: 3, confused: 1.5 })).toEqual({ helpful: 2 });
    expect(toReactionCounts(null)).toEqual({});
    expect(toReactionCounts([1, 2])).toEqual({});
  });

  it("drops unknown kinds", () => {
    expect(toReactionKinds(["love", "nope"])).toEqual(["love"]);
  });
});
