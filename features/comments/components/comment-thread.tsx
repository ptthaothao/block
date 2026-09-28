"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { commentsApi } from "../api";
import { COMMENT_COPY, COMMENT_QUERY_KEYS } from "../constants";
import type { LocalComment } from "../hooks/use-comment-sender";
import type { CommentDTO, CommentThread as Thread } from "../types";
import { mentionPrefix } from "../utils/composer-text";
import { mergeReplies } from "../utils/merge-replies";
import { CommentComposer } from "./comment-composer";
import { CommentItem } from "./comment-item";
import { LocalCommentItem } from "./local-comment-item";

type CommentThreadProps = {
  thread: Thread;
  slug: string;
  highlightId: string | null;
  locals: LocalComment[];
  onChanged: (comment: CommentDTO) => void;
  onSend: (body: string, parentId: string) => boolean;
  onRetry: (local: LocalComment) => void;
  onDiscard: (tempId: string) => void;
};

/** A comment and its one level of replies, with "Xem thêm n trả lời" and an inline reply box. */
export function CommentThread({ thread, slug, highlightId, locals, onChanged, onSend, onRetry, onDiscard }: CommentThreadProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const all = useQuery({
    queryKey: COMMENT_QUERY_KEYS.replies(thread.id),
    queryFn: () => commentsApi.replies(thread.id),
    enabled: expanded,
  });

  const replies = expanded && all.data ? mergeReplies(all.data.replies, thread.replies) : thread.replies;
  const hidden = Math.max(0, thread.replyCount - replies.filter((r) => r.status === "visible" && !r.isDeleted).length);

  const startReply = (target: CommentDTO) => {
    // Replying to a reply stays in this thread and mentions who is being answered.
    if (target.id !== thread.id && target.author) setReplyText((text) => mentionPrefix(target.author!.username, text));
    setReplyOpen(true);
  };

  return (
    <CommentItem comment={thread} slug={slug} onChanged={onChanged} onReply={startReply} highlighted={highlightId === thread.id}>
      {(replies.length > 0 || locals.length > 0 || hidden > 0 || replyOpen) && (
        <div className="mt-4 space-y-5 border-l border-border pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              slug={slug}
              onChanged={onChanged}
              onReply={startReply}
              highlighted={highlightId === reply.id}
            />
          ))}
          {hidden > 0 && (
            <Button variant="ghost" className="text-sm font-semibold text-accent" onClick={() => setExpanded(true)} disabled={all.isFetching}>
              {COMMENT_COPY.moreReplies(hidden)}
            </Button>
          )}
          {locals.map((local) => (
            <LocalCommentItem key={local.tempId} local={local} onRetry={() => onRetry(local)} onDiscard={() => onDiscard(local.tempId)} />
          ))}
          {replyOpen && (
            <CommentComposer
              value={replyText}
              onChange={setReplyText}
              placeholder={COMMENT_COPY.replyPlaceholder(thread.author?.displayName ?? "")}
              onCancel={() => setReplyOpen(false)}
              onSubmit={(body) => {
                const taken = onSend(body, thread.id);
                if (taken) {
                  setReplyText("");
                  setReplyOpen(false);
                }
                return taken;
              }}
            />
          )}
        </div>
      )}
    </CommentItem>
  );
}
