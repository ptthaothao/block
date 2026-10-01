import { Eye } from "lucide-react";

import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils/cn";

import type { CmsPostListItem } from "../../types";
import { PostStatusBadge } from "../status-badge";

type ReviewQueueItemProps = {
  post: CmsPostListItem;
  selected: boolean;
  onSelect: () => void;
  onPrefetch: () => void;
};

export function ReviewQueueItem({ post, selected, onSelect, onPrefetch }: ReviewQueueItemProps) {
  return (
    <button
      type="button"
      aria-current={selected || undefined}
      onClick={onSelect}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={cn(
        "flex w-full flex-col gap-1.5 rounded-lg border border-l-[3px] px-3 py-2.5 text-left transition",
        selected
          ? "border-accent/40 border-l-accent bg-accent/10"
          : "border-editor-line/60 border-l-editor-line bg-editor-chip/40 hover:border-editor-line hover:bg-editor-chip",
      )}
    >
      <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] leading-4">
        {post.categoryName && (
          <span className="rounded border border-editor-line bg-editor-chip px-1.5 py-px text-accent-hover">{post.categoryName}</span>
        )}
        {selected && <span className="rounded bg-emerald/15 px-1.5 py-px text-emerald">Đang xem</span>}
        <span className="ml-auto text-faint">{formatDateTime(post.updatedAt)}</span>
      </span>
      <span className="flex items-center gap-1.5 text-sm leading-5 font-bold text-text">
        <span className="truncate">{post.title}</span>
        {selected && <Eye aria-hidden className="size-3.5 shrink-0 text-accent" />}
      </span>
      <span className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-muted" />
          <span className="truncate">{post.authorName ?? "Không rõ tác giả"}</span>
        </span>
        <PostStatusBadge status={post.status} />
      </span>
    </button>
  );
}
