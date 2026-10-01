import { CircleCheck, Lightbulb, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { REVIEW_RULES } from "../../constants";
import type { ReviewCheck } from "../../utils/review-checks";

/** Automatic checks under the article, with a hint when the post is short. */
export function ReviewChecks({ checks, words }: { checks: ReviewCheck[]; words: number }) {
  const tooShort = checks.some((check) => check.id === "length" && !check.passed);

  return (
    <div className="space-y-3">
      {tooShort && (
        <div className="flex gap-3 rounded-xl border border-editor-line bg-editor-panel p-4">
          <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="space-y-1 text-xs leading-5">
            <p className="font-bold text-text">Lưu ý của hệ thống tự động</p>
            <p className="text-muted">
              Bài viết hiện có {words} từ, ít hơn mức {REVIEW_RULES.minWords} từ của một bài đầy đủ. Bạn nên kiểm tra kỹ ý
              định của tác giả trước khi duyệt xuất bản ra cộng đồng.
            </p>
          </div>
        </div>
      )}
      <ul className="grid gap-2 sm:grid-cols-3">
        {checks.map((check) => {
          const Icon = check.passed ? CircleCheck : TriangleAlert;
          return (
            <li
              key={check.id}
              className="flex items-center gap-2 rounded-lg border border-editor-line bg-editor-panel px-3 py-2.5 font-mono text-[11px] leading-4"
            >
              <Icon aria-hidden className={cn("size-3.5 shrink-0", check.passed ? "text-emerald" : "text-warning")} />
              <span className={check.passed ? "text-editor-ink" : "text-warning"}>{check.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
