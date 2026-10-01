import { describe, expect, it } from "vitest";

import { REVIEW_RULES } from "../constants";
import { reviewChecks } from "./review-checks";

const longContent = Array.from({ length: REVIEW_RULES.minWords }, () => "từ").join(" ");

const passedById = (post: Parameters<typeof reviewChecks>[0]) =>
  Object.fromEntries(reviewChecks(post).map((check) => [check.id, check.passed]));

describe("reviewChecks", () => {
  it("passes a complete post", () => {
    expect(passedById({ title: "Kiến trúc hàng đợi", excerpt: "Tóm tắt", contentMd: longContent })).toEqual({
      title: true,
      excerpt: true,
      length: true,
    });
  });

  it("flags a short title, a missing excerpt and short content", () => {
    expect(passedById({ title: " ab ", excerpt: "  ", contentMd: "ngắn thôi" })).toEqual({
      title: false,
      excerpt: false,
      length: false,
    });
    expect(passedById({ title: "Tiêu đề dài", excerpt: null, contentMd: "" }).excerpt).toBe(false);
  });
});
