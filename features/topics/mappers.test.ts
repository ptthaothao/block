import { describe, expect, it } from "vitest";

import { findTopicPage, toTagSummaries, toTopicTree } from "./mappers";

const rows = [
  { id: 1, parent_id: null, slug: "frontend", name: "Frontend", description: "UI", icon: "layout", color: "#38bdf8" },
  { id: 2, parent_id: 1, slug: "react", name: "React", description: null, icon: null, color: null },
  { id: 3, parent_id: null, slug: "backend", name: "Backend", description: null, icon: null, color: null },
];

describe("toTopicTree", () => {
  it("nests children and attaches counts", () => {
    const tree = toTopicTree(rows, [
      { category_id: 1, post_count: 5 },
      { category_id: 2, post_count: 3 },
    ]);
    expect(tree.map((t) => t.slug)).toEqual(["frontend", "backend"]);
    expect(tree[0].postCount).toBe(5);
    expect(tree[0].children).toEqual([{ slug: "react", name: "React", postCount: 3 }]);
    expect(tree[1].postCount).toBe(0);
  });
});

describe("findTopicPage", () => {
  const tree = toTopicTree(rows, []);

  it("finds a top-level topic", () => {
    const page = findTopicPage(tree, "frontend");
    expect(page?.parent).toBeNull();
    expect(page?.root.slug).toBe("frontend");
  });

  it("finds a child topic and inherits the parent's colour", () => {
    const page = findTopicPage(tree, "react");
    expect(page?.parent).toEqual({ slug: "frontend", name: "Frontend" });
    expect(page?.color).toBe("#38bdf8");
  });

  it("returns null for unknown slugs", () => {
    expect(findTopicPage(tree, "nope")).toBeNull();
  });
});

describe("toTagSummaries", () => {
  it("keeps approved tags (present in counts) sorted by use", () => {
    const tags = toTagSummaries(
      [
        { id: 1, slug: "a", name: "a" },
        { id: 2, slug: "b", name: "b" },
        { id: 3, slug: "pending", name: "pending" },
      ],
      [
        { tag_id: 1, post_count: 1 },
        { tag_id: 2, post_count: 4 },
      ],
    );
    expect(tags.map((t) => t.slug)).toEqual(["b", "a"]);
  });
});
