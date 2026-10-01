import type { CommentDTO } from "../types";

export type ReplyNode = { comment: CommentDTO; children: ReplyNode[] };

/**
 * Nest a thread's flat replies (oldest first) under the comment each one answers.
 * A reply whose parent is not in the list (hidden from this reader, or not loaded)
 * moves up to the thread itself instead of disappearing.
 */
export function buildReplyTree(rootId: string, replies: CommentDTO[]): ReplyNode[] {
  const nodes = new Map<string, ReplyNode>(replies.map((comment) => [comment.id, { comment, children: [] }]));
  const top: ReplyNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.comment.parentId === rootId ? null : nodes.get(node.comment.parentId ?? "");
    (parent ? parent.children : top).push(node);
  }
  return top;
}

/** The ids to keep on screen: each one plus its ancestors, so the path to it is expanded. */
export function withAncestors(ids: ReadonlySet<string>, replies: CommentDTO[]): Set<string> {
  const parentOf = new Map(replies.map((r) => [r.id, r.parentId]));
  const keep = new Set<string>();
  for (const id of ids) {
    for (let current: string | null | undefined = id; current && !keep.has(current); current = parentOf.get(current)) keep.add(current);
  }
  return keep;
}

/** The first `shown` direct replies, plus any reply that must stay visible (one just posted, or a linked one). */
export function shownChildren(children: ReplyNode[], shown: number, forced: ReadonlySet<string>): ReplyNode[] {
  return children.filter((node, index) => index < shown || forced.has(node.comment.id));
}
