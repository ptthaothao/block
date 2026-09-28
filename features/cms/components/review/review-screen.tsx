"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils/cn";

import { cmsApi } from "../../api";
import { CMS_QUERY_KEYS } from "../../constants";
import { useReviewPosts } from "../../hooks/use-cms-queries";
import { PageHeader } from "../page-header";
import { QueryState } from "../query-state";
import { ReviewPanel } from "./review-panel";

export function ReviewScreen() {
  const { data, isLoading, error } = useReviewPosts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((p) => p.id === selectedId) ?? data?.[0] ?? null;
  const queryClient = useQueryClient();

  function prefetchPost(id: string) {
    queryClient.prefetchQuery({ queryKey: CMS_QUERY_KEYS.post(id), queryFn: () => cmsApi.post(id) });
  }

  // The list only has title/author/date; prefetch the auto-selected post's
  // full content (incl. content_md) as soon as the list arrives, instead of
  // waiting for ReviewPanel to mount and request it.
  useEffect(() => {
    if (selected) prefetchPost(selected.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  return (
    <>
      <PageHeader title="Duyệt bài" description="Bài tác giả gửi lên, cũ nhất ở trên." />
      <QueryState isLoading={isLoading} error={error} />
      {data && data.length === 0 && <EmptyState title="Không có bài nào chờ duyệt" />}
      {data && selected && (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ul className="space-y-2">
            {data.map((post) => (
              <li key={post.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(post.id)}
                  onMouseEnter={() => prefetchPost(post.id)}
                  onFocus={() => prefetchPost(post.id)}
                  className="w-full text-left"
                >
                  <Card
                    interactive
                    className={cn("p-4", post.id === selected.id && "border-accent/60 bg-surface-hover")}
                  >
                    <p className="font-medium">{post.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {post.authorName} · {formatDateTime(post.updatedAt)}
                    </p>
                  </Card>
                </button>
              </li>
            ))}
          </ul>
          <ReviewPanel key={selected.id} postId={selected.id} />
        </div>
      )}
    </>
  );
}
