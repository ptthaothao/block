import { CMS_API_ROUTES, QUERY_PARAMS } from "@/config/routes";
import { getJson } from "@/lib/http/get-json";

import type { CmsPost, CmsPostListItem, CmsPostPage, CmsTaxonomy, PostStatus } from "./types";

/** Browser-side reads from our own API (BFF). */
export const cmsApi = {
  posts(status: PostStatus | null, offset = 0) {
    const params = new URLSearchParams();
    if (status) params.set(QUERY_PARAMS.status, status);
    if (offset) params.set(QUERY_PARAMS.offset, String(offset));
    const query = params.toString();
    return getJson<CmsPostPage>(query ? `${CMS_API_ROUTES.posts}?${query}` : CMS_API_ROUTES.posts);
  },
  post: (id: string) => getJson<CmsPost>(CMS_API_ROUTES.post(id)),
  review: () => getJson<CmsPostListItem[]>(CMS_API_ROUTES.review),
  taxonomy: () => getJson<CmsTaxonomy>(CMS_API_ROUTES.taxonomy),
};
