import { COMMENT_SORTS, DEFAULT_COMMENT_SORT } from "../constants";
import type { CommentSort } from "../types";

export function parseCommentSort(value: string | string[] | null | undefined): CommentSort {
  const raw = Array.isArray(value) ? value[0] : value;
  return COMMENT_SORTS.find((sort) => sort.id === raw)?.id ?? DEFAULT_COMMENT_SORT;
}
