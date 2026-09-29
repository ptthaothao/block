import type { InfiniteData } from "@tanstack/react-query";

import type { CommentDTO, CommentPage } from "../types";

type Pages = InfiniteData<CommentPage, unknown>;

function mapPages(data: Pages, fn: (page: CommentPage, index: number) => CommentPage): Pages {
  return { ...data, pages: data.pages.map(fn) };
}

/** Put a new comment where the reader expects it: a thread on top, a reply at the end of its thread. */
export function insertComment(data: Pages, comment: CommentDTO): Pages {
  if (comment.parentId === null) {
    return mapPages(data, (page, i) =>
      i === 0
        ? { ...page, total: page.total + 1, commentCount: page.commentCount + 1, threads: [{ ...comment, replies: [] }, ...page.threads] }
        : page,
    );
  }
  return mapPages(data, (page, i) => ({
    ...page,
    commentCount: i === 0 ? page.commentCount + 1 : page.commentCount,
    threads: page.threads.map((thread) =>
      thread.id === comment.parentId
        ? { ...thread, replyCount: thread.replyCount + 1, replies: [...thread.replies, comment] }
        : thread,
    ),
  }));
}

/** Swap in the server's latest version of a comment (after edit, delete, pin, hide). */
export function replaceComment(data: Pages, comment: CommentDTO): Pages {
  return mapPages(data, (page) => ({
    ...page,
    threads: page.threads.map((thread) =>
      thread.id === comment.id
        ? { ...thread, ...comment }
        : { ...thread, replies: thread.replies.map((reply) => (reply.id === comment.id ? comment : reply)) },
    ),
  }));
}

/** Every thread across loaded pages, without duplicates (a new comment can also arrive on a later page). */
export function flattenThreads(data: Pages) {
  const seen = new Set<string>();
  return data.pages.flatMap((page) => page.threads).filter((thread) => !seen.has(thread.id) && seen.add(thread.id));
}
