import { countWords } from "@/lib/markdown/word-count";

import { REVIEW_RULES } from "../constants";
import type { CmsPost } from "../types";

export type ReviewCheckId = "title" | "excerpt" | "length";
export type ReviewCheck = { id: ReviewCheckId; passed: boolean; label: string };

type ReviewedFields = Pick<CmsPost, "title" | "excerpt" | "contentMd">;

/** Quick automatic checks shown to the reviewer; they inform, they never block publishing. */
export function reviewChecks(post: ReviewedFields): ReviewCheck[] {
  const titleOk = post.title.trim().length >= REVIEW_RULES.titleMinChars;
  const excerptOk = Boolean(post.excerpt?.trim());
  const lengthOk = countWords(post.contentMd) >= REVIEW_RULES.minWords;
  return [
    { id: "title", passed: titleOk, label: titleOk ? "Tiêu đề hợp lệ" : "Tiêu đề quá ngắn" },
    { id: "excerpt", passed: excerptOk, label: excerptOk ? "Có đoạn trích" : "Thiếu đoạn trích" },
    {
      id: "length",
      passed: lengthOk,
      label: lengthOk ? `Đủ độ dài (≥ ${REVIEW_RULES.minWords} từ)` : `Văn bản ngắn (< ${REVIEW_RULES.minWords} từ)`,
    },
  ];
}
