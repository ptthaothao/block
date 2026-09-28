"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { useToast } from "@/lib/hooks/use-toast";
import { savePendingAction, takePendingAction } from "@/lib/pending-action/storage";

import { createComment } from "../actions";
import { COMMENT_COPY, COMMENT_PENDING_ACTION } from "../constants";
import type { CommentDTO } from "../types";

export type LocalComment = { tempId: string; parentId: string | null; body: string; state: "sending" | "failed"; error?: string };

type PendingComment = { body: string; parentId: string | null };

/**
 * Sends comments and keeps the ones in flight on screen: "Đang gửi…" while
 * sending, "Chưa gửi được · Thử lại" with the text kept if it fails. Visitors
 * get the login prompt; what they wrote is sent once they are back.
 */
export function useCommentSender(
  slug: string,
  ready: boolean,
  onCreated: (comment: CommentDTO) => void,
  /** A comment written before signing in was sent; e.g. clear its draft. */
  onResumed: (parentId: string | null) => void,
) {
  const user = useSessionUser();
  const toast = useToast();
  const [locals, setLocals] = useState<LocalComment[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const nextId = useRef(0);

  const run = useCallback(
    async (local: LocalComment): Promise<boolean> => {
      setLocals((all) => [...all.filter((l) => l.tempId !== local.tempId), { ...local, state: "sending", error: undefined }]);
      const result = await createComment({ postSlug: slug, parentId: local.parentId, body: local.body });
      if (result.ok) {
        setLocals((all) => all.filter((l) => l.tempId !== local.tempId));
        onCreated(result.data);
        return true;
      }
      setLocals((all) => all.map((l) => (l.tempId === local.tempId ? { ...l, state: "failed", error: result.error } : l)));
      return false;
    },
    [slug, onCreated],
  );

  /** True when the text was taken (sent or queued); false when the reader must sign in first. */
  const send = useCallback(
    (body: string, parentId: string | null): boolean => {
      if (!user) {
        savePendingAction<PendingComment>({ type: COMMENT_PENDING_ACTION, postSlug: slug, payload: { body, parentId } });
        setLoginOpen(true);
        return false;
      }
      void run({ tempId: `local-${++nextId.current}`, parentId, body, state: "sending" });
      return true;
    },
    [user, slug, run],
  );

  const retry = useCallback((local: LocalComment) => void run(local), [run]);
  const discard = useCallback((tempId: string) => setLocals((all) => all.filter((l) => l.tempId !== tempId)), []);

  // Back from signing in: send what they wrote.
  useEffect(() => {
    if (!user || !ready) return;
    const pending = takePendingAction<PendingComment>(COMMENT_PENDING_ACTION, slug);
    if (!pending) return;
    void run({ tempId: `local-${++nextId.current}`, ...pending.payload, state: "sending" }).then((sent) => {
      if (!sent) return;
      onResumed(pending.payload.parentId);
      toast.show({ message: COMMENT_COPY.resumed, tone: "success" });
    });
  }, [user, ready, slug, run, toast, onResumed]);

  return { locals, send, retry, discard, loginOpen, closeLogin: () => setLoginOpen(false) };
}
