"use client";

import { useCallback, useState } from "react";

import type { CommentDTO } from "../types";
import { mentionPrefix } from "../utils/composer-text";

export type ReplyBox = {
  /** The comment the box sits under. */
  targetId: string;
  /** The top-level thread the reply is sent to. */
  threadId: string;
  text: string;
};

/** The one open reply box in the section: opening another closes this one. */
export function useReplyBox() {
  const [reply, setReply] = useState<ReplyBox | null>(null);

  const open = useCallback((target: CommentDTO, threadId: string) => {
    const mention = target.isMine || !target.author ? "" : mentionPrefix(target.author.username, "");
    setReply((current) => (current?.targetId === target.id ? current : { targetId: target.id, threadId, text: mention }));
  }, []);
  const setText = useCallback((text: string) => setReply((current) => (current ? { ...current, text } : current)), []);
  const close = useCallback(() => setReply(null), []);

  return { reply, open, setText, close };
}
