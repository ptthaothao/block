import type { NextRequest } from "next/server";

import { getSessionUser } from "@/features/auth/queries";
import { INTEREST_LIMITS } from "@/features/interests/constants";
import type { FeedPage } from "@/features/interests/types";
import { parseFeedQuery } from "@/features/interests/utils/feed-query";
import { getRankedFeed } from "@/features/posts/queries";
import { jsonNoStore } from "@/lib/http/api-response";

/** "Dành cho bạn": ranked by saved interests when signed in, otherwise by the ones in the query string. */
export async function GET(request: NextRequest) {
  const { page, interests } = parseFeedQuery(request.nextUrl.searchParams);
  const user = await getSessionUser();
  const pageSize = INTEREST_LIMITS.feedPage;
  const { items, total } = await getRankedFeed({ signedIn: user !== null, interests }, page, pageSize);
  return jsonNoStore<FeedPage>({ items, nextPage: (page + 1) * pageSize < total ? page + 1 : null });
}
