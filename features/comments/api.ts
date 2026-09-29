import { API_ROUTES, CMS_API_ROUTES, QUERY_PARAMS } from "@/config/routes";
import { getJson } from "@/lib/http/get-json";

import type { CommentPage, CommentReplies, CommentSort, ModerationItem } from "./types";

/** Browser-side reads from our own API (BFF). */
export const commentsApi = {
  page: (slug: string, sort: CommentSort, page: number) => {
    const params = new URLSearchParams({ [QUERY_PARAMS.commentSort]: sort });
    if (page > 0) params.set(QUERY_PARAMS.page, String(page));
    return getJson<CommentPage>(`${API_ROUTES.postComments(slug)}?${params}`);
  },
  replies: (id: string) => getJson<CommentReplies>(API_ROUTES.commentReplies(id)),
  moderation: () => getJson<{ items: ModerationItem[] }>(CMS_API_ROUTES.moderation),
};
