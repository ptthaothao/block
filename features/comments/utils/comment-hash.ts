import { COMMENT_ANCHOR_PREFIX, POST_COMMENTS_ANCHOR } from "../constants";

/** What a URL hash asks for: the comments section, or one comment in it. */
export function parseCommentHash(hash: string): { wantsComments: boolean; commentId: string | null } {
  const id = hash.replace(/^#/, "");
  if (id.startsWith(COMMENT_ANCHOR_PREFIX)) return { wantsComments: true, commentId: id.slice(COMMENT_ANCHOR_PREFIX.length) || null };
  return { wantsComments: id === POST_COMMENTS_ANCHOR, commentId: null };
}
