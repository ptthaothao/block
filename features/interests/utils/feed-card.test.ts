import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/features/posts/types";

import { interestLabel, muteTargetOf, reasonLabel } from "./feed-card";

const post: PostSummary = {
  slug: "queue",
  title: "Queue",
  excerpt: null,
  coverUrl: null,
  level: "beginner",
  readingMinutes: 3,
  publishedAt: null,
  category: { slug: "laravel", name: "Laravel", color: "#f00", parent: null },
  authors: [],
  tags: [{ slug: "php", name: "php" }],
};

describe("feed card helpers", () => {
  it("prefixes tag reasons with #", () => {
    expect(reasonLabel({ type: "tag", label: "php" })).toBe("#php");
    expect(reasonLabel({ type: "category", label: "Laravel" })).toBe("Laravel");
    expect(interestLabel("author", "An")).toBe("An");
  });

  it("mutes the topic first, then the first tag", () => {
    expect(muteTargetOf(post)).toEqual({ type: "category", slug: "laravel", name: "Laravel", color: "#f00" });
    expect(muteTargetOf({ ...post, category: null })).toEqual({ type: "tag", slug: "php", name: "php" });
    expect(muteTargetOf({ ...post, category: null, tags: [] })).toBeNull();
  });
});
