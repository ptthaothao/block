import { describe, expect, it } from "vitest";

import type { InterestItem } from "../types";
import { applyInterestChange, hasFollows, interestsSignature, toFeedInterests, weightOf } from "./interest-state";

const react: InterestItem = { type: "category", slug: "react", name: "React", weight: 1, color: null, avatarUrl: null };
const queue: InterestItem = { type: "tag", slug: "queue", name: "queue", weight: -1, color: null, avatarUrl: null };

describe("interest state", () => {
  it("reads weights", () => {
    expect(weightOf([react], "category", "react")).toBe(1);
    expect(weightOf([react], "tag", "react")).toBe(0);
  });

  it("adds, replaces and removes", () => {
    const added = applyInterestChange([], { type: "tag", slug: "queue", name: "queue", weight: 1 });
    expect(added).toHaveLength(1);
    const muted = applyInterestChange(added, { type: "tag", slug: "queue", name: "queue", weight: -1 });
    expect(muted).toEqual([{ ...queue }]);
    expect(applyInterestChange(muted, { type: "tag", slug: "queue", name: "queue", weight: 0 })).toEqual([]);
  });

  it("groups for get_feed", () => {
    expect(toFeedInterests([react, queue])).toEqual({
      categories: ["react"],
      tags: [],
      authors: [],
      mutedCategories: [],
      mutedTags: ["queue"],
    });
  });

  it("knows when there is something to personalise with", () => {
    expect(hasFollows([queue])).toBe(false);
    expect(hasFollows([react, queue])).toBe(true);
  });

  it("signs interests independent of order", () => {
    expect(interestsSignature([react, queue])).toBe(interestsSignature([queue, react]));
    expect(interestsSignature([react])).not.toBe(interestsSignature([react, queue]));
  });
});
