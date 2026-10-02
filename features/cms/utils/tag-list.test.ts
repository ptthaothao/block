import { describe, expect, it } from "vitest";

import type { CmsTag } from "../types";
import { countTagsByStatus, filterTags, sortTags } from "./tag-list";

const tag = (id: number, name: string, status: CmsTag["status"], postCount: number): CmsTag => ({
  id,
  name,
  slug: name.toLowerCase(),
  status,
  postCount,
});

const tags = [tag(1, "react", "approved", 8), tag(2, "nextjs", "pending", 2), tag(3, "laravel", "approved", 8)];

describe("tag list", () => {
  it("filters by text and status", () => {
    expect(filterTags(tags, " NEXT ", "all").map((t) => t.id)).toEqual([2]);
    expect(filterTags(tags, "", "approved").map((t) => t.id)).toEqual([1, 3]);
    expect(filterTags(tags, "react", "pending")).toEqual([]);
  });

  it("sorts by post count then name, or by name", () => {
    expect(sortTags(tags, "posts").map((t) => t.name)).toEqual(["laravel", "react", "nextjs"]);
    expect(sortTags(tags, "name").map((t) => t.name)).toEqual(["laravel", "nextjs", "react"]);
  });

  it("counts by status", () => {
    expect(countTagsByStatus(tags)).toEqual({ all: 3, pending: 1, approved: 2 });
  });
});
