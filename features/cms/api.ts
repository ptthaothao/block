import { CMS_API_ROUTES, QUERY_PARAMS } from "@/config/routes";

import { CMS_ERROR_MESSAGES } from "./constants";
import type { CmsPost, CmsPostListItem, CmsPostPage, CmsTaxonomy, PostStatus } from "./types";

/** Browser-side reads from our own API (BFF). */
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? CMS_ERROR_MESSAGES.unknown);
  }
  return res.json() as Promise<T>;
}

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
