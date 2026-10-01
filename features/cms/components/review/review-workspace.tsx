"use client";

import { CircleCheck } from "lucide-react";

import { useCmsPost } from "../../hooks/use-cms-queries";
import type { CmsPostListItem } from "../../types";
import { QueryState } from "../query-state";
import { ReviewArticle } from "./review-article";
import { ReviewDecisionPanel } from "./review-decision-panel";
import { ReviewPostStats } from "./review-post-stats";

/** Middle and right columns for the selected post. Keyed by post id so the note resets per post. */
export function ReviewWorkspace({ item }: { item: CmsPostListItem }) {
  const { data: post, isLoading, error } = useCmsPost(item.id);

  if (!post) {
    return (
      <div className="flex-1 p-6">
        <QueryState isLoading={isLoading} error={error} />
      </div>
    );
  }

  return (
    <>
      <div className="min-w-0 flex-1 bg-editor-base px-4 py-5 sm:px-6 lg:overflow-y-auto">
        <ReviewArticle post={post} item={item} />
      </div>
      <aside
        aria-label="Quyết định duyệt"
        className="flex flex-col gap-4 border-editor-line bg-editor-header p-4 max-lg:border-t lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-l xl:w-[22rem]"
      >
        <ReviewDecisionPanel post={post} />
        <ReviewPostStats post={post} />
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald/25 bg-emerald/10 p-3 text-[11px] leading-4 text-emerald"
        >
          <CircleCheck aria-hidden className="size-4 shrink-0" />
          <span>
            Đang xem xét bài <strong>{post.title}</strong>. Mọi tác vụ đã sẵn sàng.
          </span>
        </p>
      </aside>
    </>
  );
}
