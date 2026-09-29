import type { NextRequest } from "next/server";

import { QUERY_PARAMS } from "@/config/routes";
import { getCommentPage } from "@/features/comments/queries";
import type { CommentPage } from "@/features/comments/types";
import { parseCommentSort } from "@/features/comments/utils/comment-sort";
import { parsePage } from "@/features/posts/utils/post-filters";
import { jsonNoStore, notFound } from "@/lib/http/api-response";

export async function GET(request: NextRequest, { params }: RouteContext<"/api/posts/[slug]/comments">) {
  const search = request.nextUrl.searchParams;
  const page = await getCommentPage(
    (await params).slug,
    parseCommentSort(search.get(QUERY_PARAMS.commentSort)),
    parsePage(search.get(QUERY_PARAMS.page) ?? undefined),
  );
  return page ? jsonNoStore<CommentPage>(page) : notFound();
}
