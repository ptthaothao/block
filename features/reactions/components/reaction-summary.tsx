"use client";

import { MessageSquare } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { POST_ANCHORS, REACTION_COPY } from "../constants";
import { usePostReactions } from "../hooks/use-post-reactions";
import { totalReactions, usedReactions } from "../utils/reaction-state";

/**
 * Social proof under the title: counts only (not buttons) and the comment
 * count, which jumps to the comments. Fixed height, so nothing shifts when it loads.
 */
export function ReactionSummary({ slug }: { slug: string }) {
  const { data, isLoading } = usePostReactions(slug);

  return (
    <div className="mt-5 flex h-7 items-center gap-4 text-sm text-muted">
      {isLoading || !data ? (
        <Skeleton className="h-5 w-40" />
      ) : (
        <>
          {totalReactions(data.counts) > 0 && (
            <a
              href={`#${POST_ANCHORS.reactions}`}
              aria-label={REACTION_COPY.summaryLabel(totalReactions(data.counts))}
              className="inline-flex items-center gap-3 transition hover:text-text"
            >
              {usedReactions(data.counts).map((r) => (
                <span key={r.kind} className="inline-flex items-center gap-1 tabular-nums">
                  <span aria-hidden>{r.emoji}</span>
                  {data.counts[r.kind]}
                </span>
              ))}
            </a>
          )}
          <a
            href={`#${POST_ANCHORS.comments}`}
            className="inline-flex items-center gap-1.5 tabular-nums transition hover:text-text"
            aria-label={REACTION_COPY.comments(data.commentCount)}
          >
            <MessageSquare aria-hidden className="size-4" />
            {data.commentCount}
          </a>
        </>
      )}
    </div>
  );
}
