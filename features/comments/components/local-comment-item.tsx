"use client";

import { Avatar } from "@/components/ui/avatar";
import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { cn } from "@/lib/utils/cn";

import { COMMENT_COPY } from "../constants";
import type { LocalComment } from "../hooks/use-comment-sender";

type LocalCommentItemProps = { local: LocalComment; onRetry: () => void; onDiscard: () => void };

/** A comment on its way: faded while sending, red with "Thử lại" (text kept) if it failed. */
export function LocalCommentItem({ local, onRetry, onDiscard }: LocalCommentItemProps) {
  const user = useSessionUser();
  const failed = local.state === "failed";
  return (
    <div
      className={cn("flex gap-3 rounded-lg", failed ? "border border-danger/60 p-3" : "opacity-60")}
      aria-busy={!failed}
    >
      {user && <Avatar name={user.displayName} src={user.avatarUrl} size="md" className="shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{user?.displayName}</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-text">{local.body}</p>
        <p role={failed ? "alert" : "status"} className={cn("mt-2 text-xs", failed ? "text-danger" : "text-faint")}>
          {failed ? (
            <>
              {local.error ?? COMMENT_COPY.sendFailed} ·{" "}
              <button type="button" onClick={onRetry} className="font-semibold underline underline-offset-2">
                {COMMENT_COPY.retry}
              </button>{" "}
              ·{" "}
              <button type="button" onClick={onDiscard} className="underline underline-offset-2">
                {COMMENT_COPY.cancel}
              </button>
            </>
          ) : (
            COMMENT_COPY.sending
          )}
        </p>
      </div>
    </div>
  );
}
