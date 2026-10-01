"use client";

import { useCallback, useState } from "react";

import { INITIAL_VISIBLE_REPLIES, REPLIES_BATCH_SIZE } from "../constants";

/** How many direct replies each comment shows, by comment id. Everything starts at the initial count. */
export function useReplyVisibility() {
  const [shown, setShown] = useState<Record<string, number>>({});
  const shownFor = useCallback((commentId: string) => shown[commentId] ?? INITIAL_VISIBLE_REPLIES, [shown]);
  const showMore = useCallback(
    (commentId: string) => setShown((all) => ({ ...all, [commentId]: (all[commentId] ?? INITIAL_VISIBLE_REPLIES) + REPLIES_BATCH_SIZE })),
    [],
  );
  return { shownFor, showMore };
}
