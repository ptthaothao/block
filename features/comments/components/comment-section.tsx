"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { LoginModal } from "@/features/auth/components/login-modal";
import { ROUTES } from "@/config/routes";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useInView } from "@/lib/hooks/use-in-view";

import { COMMENT_ANCHOR_PREFIX, COMMENT_COPY, COMMENT_SORTS, COMMENTS_LAZY_ROOT_MARGIN, POST_COMMENTS_ANCHOR } from "../constants";
import { useCommentDraft } from "../hooks/use-comment-draft";
import { useCommentSender } from "../hooks/use-comment-sender";
import { useCommentSort } from "../hooks/use-comment-sort";
import { useReplyBox } from "../hooks/use-reply-box";
import { useComments } from "../hooks/use-comments";
import type { CommentDTO, CommentSort } from "../types";
import { flattenThreads } from "../utils/comment-cache";
import { parseCommentHash } from "../utils/comment-hash";
import { CommentComposer } from "./comment-composer";
import { CommentSectionFallback } from "./comment-section-fallback";
import { CommentSkeleton } from "./comment-skeleton";
import { CommentThread } from "./comment-thread";
import { LocalCommentItem } from "./local-comment-item";

const SECTION_TITLE_ID = "comments-title";

/**
 * Comments under a post. Loaded when the reader scrolls near (or arrives via
 * #comments / #comment-<id>), never while the article itself is loading.
 */
export function CommentSection({ slug }: { slug: string }) {
  // The composer shows the reader's avatar and saved draft, which the server
  // cannot know; render the placeholder until hydrated so nothing mismatches.
  return useHydrated() ? <CommentSectionBody slug={slug} /> : <CommentSectionFallback />;
}

function CommentSectionBody({ slug }: { slug: string }) {
  const [ref, inView] = useInView<HTMLElement>(COMMENTS_LAZY_ROOT_MARGIN);
  const [target] = useState(() => parseCommentHash(window.location.hash));
  const [sort, setSort] = useCommentSort();
  const { query, added, changed } = useComments(slug, sort, inView || target.wantsComments);
  const [draft, setDraft, clearDraft] = useCommentDraft(slug);
  const replyBox = useReplyBox();
  // Replies that must stay visible even under a collapsed comment: ones just posted, and a linked one.
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set(target.commentId ? [target.commentId] : []));
  const onCreated = useCallback(
    (comment: CommentDTO) => {
      added(comment);
      setRevealed((ids) => new Set(ids).add(comment.id));
      // Once the new reply is on the page, bring it into view if it is off screen.
      requestAnimationFrame(() =>
        document.getElementById(COMMENT_ANCHOR_PREFIX + comment.id)?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      );
    },
    [added],
  );
  const sender = useCommentSender(slug, query.isSuccess, onCreated, (parentId) => {
    if (parentId === null) clearDraft();
  });

  // Arrived from a link to one comment: bring it into view once it is on the page.
  const loaded = query.isSuccess;
  useEffect(() => {
    if (!loaded || !target.commentId) return;
    document.getElementById(COMMENT_ANCHOR_PREFIX + target.commentId)?.scrollIntoView({ block: "center" });
  }, [loaded, target.commentId]);

  const threads = query.data ? flattenThreads(query.data) : [];
  const count = query.data?.pages[0]?.commentCount;
  const topLocals = sender.locals.filter((l) => l.parentId === null);
  const replyLocals = sender.locals.filter((l) => l.parentId !== null);

  return (
    <section ref={ref} id={POST_COMMENTS_ANCHOR} aria-labelledby={SECTION_TITLE_ID} className="mt-14 scroll-mt-24">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={SECTION_TITLE_ID} className="font-display text-2xl font-bold">
          {COMMENT_COPY.title(count ?? 0)}
        </h2>
        <label className="flex items-center gap-2">
          <span className="sr-only">{COMMENT_COPY.sortLabel}</span>
          <Select value={sort} onChange={(event) => setSort(event.target.value as CommentSort)} className="w-auto py-2">
            {COMMENT_SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <CommentComposer
        value={draft}
        onChange={setDraft}
        onSubmit={(body) => {
          const taken = sender.send(body, null);
          if (taken) clearDraft();
          return taken;
        }}
      />

      <div className="mt-8 space-y-8">
        {topLocals.map((local) => (
          <LocalCommentItem
            key={local.tempId}
            local={local}
            onRetry={() => sender.retry(local)}
            onDiscard={() => sender.discard(local.tempId)}
          />
        ))}

        {query.isPending ? (
          <CommentSkeleton />
        ) : query.isError ? (
          <EmptyState title={COMMENT_COPY.loadFailed}>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => query.refetch()}>
              {COMMENT_COPY.retry}
            </Button>
          </EmptyState>
        ) : threads.length === 0 && topLocals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-6 py-8 text-center text-sm text-muted">{COMMENT_COPY.empty}</p>
        ) : (
          threads.map((thread) => (
            <CommentThread
              key={thread.id}
              thread={thread}
              slug={slug}
              highlightId={target.commentId}
              locals={replyLocals}
              onChanged={changed}
              revealed={revealed}
              reply={replyBox.reply?.threadId === thread.id ? replyBox.reply : null}
              onReplyOpen={replyBox.open}
              onReplyText={replyBox.setText}
              onReplyClose={replyBox.close}
              onSend={sender.send}
              onRetry={sender.retry}
              onDiscard={sender.discard}
            />
          ))
        )}

        {query.hasNextPage && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage}>
              {COMMENT_COPY.loadMore}
            </Button>
          </div>
        )}
      </div>

      <LoginModal
        open={sender.loginOpen}
        onClose={sender.closeLogin}
        next={`${ROUTES.post(slug)}#${POST_COMMENTS_ANCHOR}`}
        reason={COMMENT_COPY.loginReason}
      />
    </section>
  );
}
