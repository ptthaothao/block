"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { QUERY_PARAMS } from "@/config/routes";

import { DEFAULT_COMMENT_SORT, POST_COMMENTS_ANCHOR } from "../constants";
import type { CommentSort } from "../types";
import { parseCommentSort } from "../utils/comment-sort";

/** The comment sort lives in the URL (?comments=new), so Back and shared links keep it. */
export function useCommentSort(): [CommentSort, (sort: CommentSort) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sort = parseCommentSort(params.get(QUERY_PARAMS.commentSort));

  const setSort = useCallback(
    (next: CommentSort) => {
      const search = new URLSearchParams(params.toString());
      if (next === DEFAULT_COMMENT_SORT) search.delete(QUERY_PARAMS.commentSort);
      else search.set(QUERY_PARAMS.commentSort, next);
      const query = search.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}#${POST_COMMENTS_ANCHOR}`, { scroll: false });
    },
    [params, router, pathname],
  );

  return [sort, setSort];
}
