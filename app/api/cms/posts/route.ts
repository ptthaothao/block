import type { NextRequest } from "next/server";

import { QUERY_PARAMS } from "@/config/routes";
import { authorize } from "@/features/auth/guards";
import { listCmsPosts } from "@/features/cms/queries";
import { postOffsetSchema, postStatusFilterSchema } from "@/features/cms/schemas";
import { badRequest, forbidden, jsonNoStore } from "@/lib/http/api-response";

export async function GET(request: NextRequest) {
  const user = await authorize("author");
  if (!user) return forbidden();

  const status = postStatusFilterSchema.safeParse(request.nextUrl.searchParams.get(QUERY_PARAMS.status));
  if (!status.success) return badRequest();

  const offsetParam = request.nextUrl.searchParams.get(QUERY_PARAMS.offset);
  const offset = postOffsetSchema.safeParse(offsetParam ? Number(offsetParam) : 0);
  if (!offset.success) return badRequest();

  return jsonNoStore(await listCmsPosts(user, status.data, offset.data));
}
