import { describe, expect, it } from "vitest";

import type { CmsPostListItem } from "../types";
import { filterReviewQueue } from "./review-queue-filter";

const post = (id: string, title: string, authorName: string | null, categoryName: string | null): CmsPostListItem => ({
  id,
  title,
  slug: id,
  status: "review",
  updatedAt: "2026-10-01T00:00:00Z",
  publishedAt: null,
  reviewNote: null,
  categoryName,
  authorName,
});

const posts = [
  post("a", "Tối ưu hóa Core Web Vitals", "namnguyen", "Performance"),
  post("b", "Hàng đợi trong Laravel", "test_author", "Backend"),
  post("c", "Đường dẫn động", null, null),
];

describe("filterReviewQueue", () => {
  it("returns every post for a blank query", () => {
    expect(filterReviewQueue(posts, "  ")).toEqual(posts);
  });

  it("matches title, author and category, ignoring case and diacritics", () => {
    expect(filterReviewQueue(posts, "toi uu").map((p) => p.id)).toEqual(["a"]);
    expect(filterReviewQueue(posts, "TEST_AUTHOR").map((p) => p.id)).toEqual(["b"]);
    expect(filterReviewQueue(posts, "backend").map((p) => p.id)).toEqual(["b"]);
    expect(filterReviewQueue(posts, "duong dan").map((p) => p.id)).toEqual(["c"]);
  });
});
