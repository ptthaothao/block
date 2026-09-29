import { describe, expect, it } from "vitest";

import { toPostSummary } from "./mappers";
import type { PostSummaryRow } from "./rows";

const row: PostSummaryRow = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: "queue",
  title: "Queue",
  excerpt: null,
  cover_url: null,
  level: "beginner",
  reading_minutes: 3,
  published_at: "2026-09-01T00:00:00Z",
  category: [{ slug: "laravel", name: "Laravel", color: null, parent: { slug: "backend", name: "Backend" } }],
  post_authors: [
    { position: 1, profile: { username: "b", display_name: "B", avatar_url: null } },
    { position: 0, profile: { username: "a", display_name: "A", avatar_url: null } },
  ],
  post_tags: [{ tag: { slug: "php", name: "php" } }, { tag: null }],
};

describe("post mappers", () => {
  it("orders authors by position and drops hidden tags", () => {
    const post = toPostSummary(row);
    expect(post.authors.map((a) => a.username)).toEqual(["a", "b"]);
    expect(post.tags).toEqual([{ slug: "php", name: "php" }]);
    expect(post.category?.parent).toEqual({ slug: "backend", name: "Backend" });
  });
});
