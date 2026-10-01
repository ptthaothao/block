import { describe, expect, it } from "vitest";

import { applyToggle, reactionMeta, rankedReactions, totalReactions, usedReactions } from "./reaction-state";

describe("reaction state", () => {
  it("adds and removes the reader's pick", () => {
    const on = applyToggle({ counts: { love: 2 }, mine: [] }, "helpful");
    expect(on).toEqual({ counts: { love: 2, helpful: 1 }, mine: ["helpful"] });
    expect(applyToggle(on, "helpful")).toEqual({ counts: { love: 2 }, mine: [] });
  });

  it("replaces the reader's pick instead of adding a second one", () => {
    const switched = applyToggle({ counts: { helpful: 1, love: 2 }, mine: ["helpful"] }, "love");
    expect(switched).toEqual({ counts: { love: 3 }, mine: ["love"] });
  });

  it("totals and lists used emoji in display order", () => {
    const counts = { confused: 1, helpful: 3 };
    expect(totalReactions(counts)).toBe(4);
    expect(usedReactions(counts).map((r) => r.kind)).toEqual(["helpful", "confused"]);
    expect(reactionMeta("love").emoji).toBe("❤️");
  });

  it("ranks emoji by count, most first", () => {
    const ranked = rankedReactions({ confused: 1, helpful: 3, love: 1 });
    expect(ranked.map((r) => [r.kind, r.count])).toEqual([["helpful", 3], ["love", 1], ["confused", 1]]);
  });
});
