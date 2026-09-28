"use client";

import { useEffect, useState } from "react";

import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

import { COMMENT_DRAFT_STORAGE_PREFIX, COMMENT_TIMINGS } from "../constants";

function readDraft(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeDraft(key: string, value: string) {
  try {
    if (value.trim()) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Storage blocked: the draft lives only while the page is open.
  }
}

/**
 * The unsent comment for a post, kept in localStorage so a reload, a crash or
 * a trip through sign-in never loses it. Only mounted in the browser.
 */
export function useCommentDraft(slug: string) {
  const key = COMMENT_DRAFT_STORAGE_PREFIX + slug;
  const [draft, setDraft] = useState(() => (typeof window === "undefined" ? "" : readDraft(key)));
  const debounced = useDebouncedValue(draft, COMMENT_TIMINGS.draftDebounceMs);

  useEffect(() => writeDraft(key, debounced), [key, debounced]);

  const clear = () => {
    setDraft("");
    writeDraft(key, "");
  };
  return [draft, setDraft, clear] as const;
}
