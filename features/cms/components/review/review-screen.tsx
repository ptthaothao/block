"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { cmsApi } from "../../api";
import { CMS_QUERY_KEYS } from "../../constants";
import { useReviewPosts } from "../../hooks/use-cms-queries";
import { ReviewQueue } from "./review-queue";
import { ReviewWorkspace } from "./review-workspace";

/**
 * Full-bleed review workspace: queue on the left, the post in the middle,
 * the decision on the right. On large screens it fills the viewport under
 * the CMS topbar (h-16) and each column scrolls on its own.
 */
export function ReviewScreen() {
  const { data, isLoading, error, isFetching, refetch } = useReviewPosts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((p) => p.id === selectedId) ?? data?.[0] ?? null;
  const queryClient = useQueryClient();

  function prefetchPost(id: string) {
    queryClient.prefetchQuery({ queryKey: CMS_QUERY_KEYS.post(id), queryFn: () => cmsApi.post(id) });
  }

  // The list only has title/author/date; prefetch the auto-selected post's
  // full content (incl. content_md) as soon as the list arrives, instead of
  // waiting for ReviewWorkspace to mount and request it.
  useEffect(() => {
    if (selected) prefetchPost(selected.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  return (
    <div className="flex flex-col font-display lg:h-[calc(100dvh-4rem)] lg:flex-row">
      <ReviewQueue
        posts={data}
        isLoading={isLoading}
        error={error}
        refreshing={isFetching}
        onRefresh={() => void refetch()}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
        onPrefetch={prefetchPost}
      />
      {selected ? (
        <ReviewWorkspace key={selected.id} item={selected} />
      ) : (
        <div className="grid flex-1 place-items-center bg-editor-base p-10 text-center">
          {data && (
            <div>
              <p className="text-lg font-bold text-text">Không có bài nào chờ duyệt</p>
              <p className="mt-1 text-sm text-muted">Bài tác giả gửi lên sẽ xuất hiện ở cột bên trái.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
