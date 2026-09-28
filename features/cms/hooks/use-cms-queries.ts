"use client";

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { cmsApi } from "../api";
import { CMS_QUERY_KEYS, CMS_TIMINGS } from "../constants";
import type { PostStatus } from "../types";

/** Paginated (load more) list of posts for a status tab. */
export function useCmsPosts(status: PostStatus | null) {
  return useInfiniteQuery({
    queryKey: CMS_QUERY_KEYS.posts(status),
    queryFn: ({ pageParam }) => cmsApi.posts(status, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    // Keep showing the previous status tab's rows (dimmed by isPlaceholderData)
    // while the new tab loads, instead of flashing back to a loading state.
    placeholderData: keepPreviousData,
  });
}

export function useCmsPost(id: string) {
  return useQuery({ queryKey: CMS_QUERY_KEYS.post(id), queryFn: () => cmsApi.post(id) });
}

export function useReviewPosts() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.review,
    queryFn: cmsApi.review,
    // Several editors can be working the queue at once; refetch on refocus
    // so a stale "already reviewed" post doesn't linger in the list.
    refetchOnWindowFocus: true,
  });
}

export function useCmsTaxonomy() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy,
    queryFn: cmsApi.taxonomy,
    // Categories/tags/series change far less often than posts.
    staleTime: CMS_TIMINGS.taxonomyStaleTimeMs,
  });
}
