"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { commentsApi } from "../api";
import { COMMENT_COPY, COMMENT_QUERY_KEYS } from "../constants";
import type { LocalComment } from "../hooks/use-comment-sender";
import type { ReplyBox } from "../hooks/use-reply-box";
import type { CommentDTO, CommentThread as Thread } from "../types";
import { useReplyVisibility } from "../hooks/use-reply-visibility";
import { buildReplyTree, shownChildren, withAncestors, type ReplyNode } from "../utils/comment-tree";
import { mergeReplies } from "../utils/merge-replies";
import { CommentNode } from "./comment-branch";
import { CommentComposer } from "./comment-composer";
import { CommentItem } from "./comment-item";
import { LocalCommentItem } from "./local-comment-item";

type CommentThreadProps = {
  thread: Thread;
  slug: string;
  highlightId: string | null;
  /** Replies still being sent; each shows under the comment it answers. */
  locals: LocalComment[];
  /** Replies that stay visible even when their parent is collapsed. */
  revealed: ReadonlySet<string>;
  onChanged: (comment: CommentDTO) => void;
  /** The section's single open reply box; shown here only when it sits under one of this thread's comments. */
  reply: ReplyBox | null;
  onReplyOpen: (target: CommentDTO, threadId: string) => void;
  onReplyText: (text: string) => void;
  onReplyClose: () => void;
  onSend: (body: string, parentId: string) => boolean;
  onRetry: (local: LocalComment) => void;
  onDiscard: (tempId: string) => void;
};

/**
 * A comment and its replies at any depth. Every comment shows its first reply and a
 * "Xem thêm n bình luận" for the rest. Until the API reports direct-reply counts,
 * the whole thread is fetched as soon as the page shows only part of it.
 */
export function CommentThread({
  thread,
  slug,
  highlightId,
  locals,
  revealed,
  onChanged,
  reply,
  onReplyOpen,
  onReplyText,
  onReplyClose,
  onSend,
  onRetry,
  onDiscard,
}: CommentThreadProps) {
  const visibility = useReplyVisibility();
  const loadedVisible = thread.replies.filter((r) => r.status === "visible" && !r.isDeleted).length;
  const all = useQuery({
    queryKey: COMMENT_QUERY_KEYS.replies(thread.id),
    queryFn: () => commentsApi.replies(thread.id),
    enabled: thread.replyCount > loadedVisible,
  });

  const replies = all.data ? mergeReplies(all.data.replies, thread.replies) : thread.replies;
  const tree = buildReplyTree(thread.id, replies);
  const forced = withAncestors(revealed, replies);

  const startReply = (target: CommentDTO) => onReplyOpen(target, thread.id);

  // A reply belongs to the exact comment it was written under.
  const replyBoxFor = (comment: CommentDTO) =>
    reply?.targetId === comment.id ? (
      <CommentComposer
        key={comment.id}
        value={reply.text}
        onChange={onReplyText}
        placeholder={COMMENT_COPY.replyPlaceholder(comment.author?.displayName ?? "")}
        onCancel={onReplyClose}
        autoFocus
        onSubmit={(body) => {
          const taken = onSend(body, comment.id);
          if (taken) onReplyClose();
          return taken;
        }}
      />
    ) : undefined;

  const localsUnder = (commentId: string) =>
    locals
      .filter((local) => local.parentId === commentId)
      .map((local) => (
        <CommentNode key={local.tempId}>
          <LocalCommentItem local={local} onRetry={() => onRetry(local)} onDiscard={() => onDiscard(local.tempId)} />
        </CommentNode>
      ));

  const moreNode = (commentId: string, remaining: number) =>
    remaining > 0 && (
      <CommentNode>
        <Button
          variant="ghost"
          className="h-[var(--avatar-size)] min-h-0 py-0 text-sm font-semibold text-accent"
          onClick={() => visibility.showMore(commentId)}
        >
          {COMMENT_COPY.moreReplies(remaining)}
        </Button>
      </CommentNode>
    );

  const renderChildren = (parentId: string, children: ReplyNode[]) => {
    const shown = shownChildren(children, visibility.shownFor(parentId), forced);
    return (
      <>
        {shown.map(renderNode)}
        {moreNode(parentId, children.length - shown.length)}
        {localsUnder(parentId)}
      </>
    );
  };

  const renderNode = ({ comment, children }: ReplyNode) => (
    <CommentNode key={comment.id}>
      <CommentItem
        comment={comment}
        slug={slug}
        onChanged={onChanged}
        onReply={startReply}
        replyBox={replyBoxFor(comment)}
        highlighted={highlightId === comment.id}
      >
        {renderChildren(comment.id, children)}
      </CommentItem>
    </CommentNode>
  );

  return (
    <CommentItem
      comment={thread}
      slug={slug}
      onChanged={onChanged}
      onReply={startReply}
      replyBox={replyBoxFor(thread)}
      highlighted={highlightId === thread.id}
    >
      {renderChildren(thread.id, tree)}
      {all.isError && (
        <CommentNode>
          <Button variant="ghost" className="h-[var(--avatar-size)] min-h-0 py-0 text-sm text-danger" onClick={() => all.refetch()}>
            {COMMENT_COPY.repliesFailed} {COMMENT_COPY.retry}
          </Button>
        </CommentNode>
      )}
    </CommentItem>
  );
}
