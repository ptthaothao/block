import type { CommentDTO } from "../types";

/** The full reply list, preferring the page cache's copy of any reply that was just added or changed. */
export function mergeReplies(full: CommentDTO[], fromPage: CommentDTO[]): CommentDTO[] {
  const latest = new Map(fromPage.map((r) => [r.id, r]));
  const known = new Set(full.map((r) => r.id));
  return [...full.map((r) => latest.get(r.id) ?? r), ...fromPage.filter((r) => !known.has(r.id))];
}
