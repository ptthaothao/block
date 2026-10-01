"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { formatRelativeTime } from "@/lib/format/relative-time";
import { cn } from "@/lib/utils/cn";

import type { CmsPostListItem } from "../../types";
import { filterReviewQueue } from "../../utils/review-queue-filter";
import { EditorIcon } from "../editor/editor-icon";
import { SettingsInput } from "../editor/settings/settings-controls";
import { QueryState } from "../query-state";
import { ReviewQueueItem } from "./review-queue-item";

const SEARCH_ID = "review-search";

type ReviewQueueProps = {
  posts: CmsPostListItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refreshing: boolean;
  onRefresh: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPrefetch: (id: string) => void;
};

/** Left column: the posts waiting for review, oldest first, with a quick filter. */
export function ReviewQueue({ posts, isLoading, error, refreshing, onRefresh, selectedId, onSelect, onPrefetch }: ReviewQueueProps) {
  const [query, setQuery] = useState("");
  const visible = posts ? filterReviewQueue(posts, query) : [];
  // The API sorts by updated_at ascending, so the first post has waited longest.
  const oldest = posts?.[0];

  return (
    <aside
      aria-label="Bài chờ duyệt"
      className="flex flex-col border-editor-line bg-editor-panel max-lg:border-b lg:w-80 lg:shrink-0 lg:border-r"
    >
      <div className="flex flex-col gap-3 border-b border-editor-line px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="flex items-center gap-2 text-lg leading-6 font-extrabold text-white">
              Duyệt bài
              {posts && (
                <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] leading-3 font-medium text-accent-hover">
                  {posts.length} chờ
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-[11px] leading-4 text-muted">Bài tác giả gửi lên, cũ nhất ở trên.</p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Tải lại danh sách"
            className="rounded-md p-1.5 text-muted transition hover:bg-editor-chip hover:text-text disabled:opacity-60"
          >
            <RefreshCw aria-hidden className={cn("size-3.5", refreshing && "animate-spin motion-reduce:animate-none")} />
          </button>
        </div>
        <div className="relative">
          <label htmlFor={SEARCH_ID} className="sr-only">
            Lọc bài chờ duyệt
          </label>
          <EditorIcon name="search" className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2" />
          <SettingsInput
            id={SEARCH_ID}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Lọc theo tác giả, tiêu đề…"
            className="pl-8 placeholder:text-faint"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 px-3 py-3 lg:overflow-y-auto">
        <QueryState isLoading={isLoading} error={error} />
        {posts && posts.length === 0 && <p className="py-10 text-center text-sm text-muted">Không có bài nào chờ duyệt.</p>}
        {posts && posts.length > 0 && visible.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">Không có bài khớp “{query.trim()}”.</p>
        )}
        <ul className="space-y-2 max-lg:max-h-80 max-lg:overflow-y-auto">
          {visible.map((post) => (
            <li key={post.id}>
              <ReviewQueueItem
                post={post}
                selected={post.id === selectedId}
                onSelect={() => onSelect(post.id)}
                onPrefetch={() => onPrefetch(post.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {posts && posts.length > 0 && (
        <p className="border-t border-editor-line bg-editor-base/60 px-4 py-2.5 font-mono text-[10px] leading-4 text-muted">
          Tổng cộng: {posts.length} bài
          {oldest && <> · Bài cũ nhất: {formatRelativeTime(oldest.updatedAt)}</>}
        </p>
      )}
    </aside>
  );
}
