"use client";

import { useEffect, useState } from "react";

import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

import { previewMarkdown } from "../actions/preview";
import { CMS_TIMINGS } from "../constants";

/**
 * Server-rendered preview HTML for `markdown`.
 *
 * Debounced by default (for an author actively typing). Pass `debounce:
 * false` for static content (e.g. a reviewer opening a post to read it),
 * where there's nothing to wait out and the delay only adds latency.
 */
export function useMarkdownPreview(markdown: string, enabled: boolean, options: { debounce?: boolean } = {}) {
  const { debounce = true } = options;
  const debounced = useDebouncedValue(markdown, debounce ? CMS_TIMINGS.previewDebounceMs : 0);
  const value = debounce ? debounced : markdown;
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    previewMarkdown(value).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setHtml(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [value, enabled]);

  return { html, error };
}
