import { describe, expect, it } from "vitest";

import type { CmsCategory } from "../types";
import { buildCategoryTree, filterCategoryTree } from "./category-tree";

const category = (id: number, parentId: number | null, name: string, position: number, postCount = 0): CmsCategory => ({
  id,
  parentId,
  name,
  slug: name.toLowerCase(),
  description: null,
  icon: null,
  color: null,
  position,
  postCount,
});

const categories = [
  category(2, null, "Backend", 1, 1),
  category(1, null, "Frontend", 0, 2),
  category(12, 1, "Vue", 1, 15),
  category(11, 1, "React", 0, 22),
  category(21, 2, "Laravel", 0, 24),
];

describe("category tree", () => {
  it("nests children under parents in position order and totals posts", () => {
    const tree = buildCategoryTree(categories);
    expect(tree.map((n) => n.category.name)).toEqual(["Frontend", "Backend"]);
    expect(tree[0].children.map((c) => c.name)).toEqual(["React", "Vue"]);
    expect(tree[0].totalPosts).toBe(39);
    expect(tree[1].totalPosts).toBe(25);
  });

  it("keeps a matching parent whole and only the matching children otherwise", () => {
    const tree = buildCategoryTree(categories);
    expect(filterCategoryTree(tree, "front")[0].children).toHaveLength(2);
    const byChild = filterCategoryTree(tree, " VUE ");
    expect(byChild.map((n) => n.category.name)).toEqual(["Frontend"]);
    expect(byChild[0].children.map((c) => c.name)).toEqual(["Vue"]);
    expect(filterCategoryTree(tree, "nothing")).toEqual([]);
    expect(filterCategoryTree(tree, "  ")).toBe(tree);
  });
});
