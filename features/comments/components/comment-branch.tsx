import type { ReactNode } from "react";

/** The replies under one comment. Draws nothing itself; its nodes get the connectors (globals.css). */
export function CommentBranch({ children }: { children: ReactNode }) {
  return <div className="comment-branch">{children}</div>;
}

/** One item in a branch: a reply, the reply box, "Xem thêm n trả lời" or a reply being sent. */
export function CommentNode({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
