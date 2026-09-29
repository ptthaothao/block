"use client";

import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";

import { REACTION_QUERY_KEYS } from "@/features/reactions/constants";

import { commentsApi } from "../api";
import { COMMENT_QUERY_KEYS, COMMENT_TIMINGS } from "../constants";
import type { CommentDTO, CommentPage, CommentSort } from "../types";
import { insertComment, replaceComment } from "../utils/comment-cache";

type Pages = InfiniteData<CommentPage, unknown>;

/** Comment threads of a post, page by page, plus helpers to show writes right away. */
export function useComments(slug: string, sort: CommentSort, enabled: boolean) {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: COMMENT_QUERY_KEYS.post(slug, sort),
    queryFn: ({ pageParam }) => commentsApi.page(slug, sort, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage ?? undefined,
    enabled,
    staleTime: COMMENT_TIMINGS.staleMs,
    refetchOnWindowFocus: true,
  });

  const update = useCallback(
    (fn: (data: Pages) => Pages) => {
      queryClient.setQueriesData<Pages>({ queryKey: COMMENT_QUERY_KEYS.postAll(slug) }, (data) => (data ? fn(data) : data));
      // The comment count on the reaction widgets.
      void queryClient.invalidateQueries({ queryKey: REACTION_QUERY_KEYS.post(slug) });
    },
    [queryClient, slug],
  );

  const added = useCallback((comment: CommentDTO) => update((data) => insertComment(data, comment)), [update]);
  const changed = useCallback(
    (comment: CommentDTO) => {
      update((data) => replaceComment(data, comment));
      if (comment.parentId) {
        queryClient.setQueryData<{ replies: CommentDTO[] }>(COMMENT_QUERY_KEYS.replies(comment.parentId), (data) =>
          data ? { replies: data.replies.map((r) => (r.id === comment.id ? comment : r)) } : data,
        );
      }
    },
    [update, queryClient],
  );

  return { query, added, changed };
}
