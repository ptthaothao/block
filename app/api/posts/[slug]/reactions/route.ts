import { getPostReactions } from "@/features/reactions/queries";
import type { PostReactions } from "@/features/reactions/types";
import { jsonNoStore, notFound } from "@/lib/http/api-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/posts/[slug]/reactions">) {
  const reactions = await getPostReactions((await params).slug);
  return reactions ? jsonNoStore<PostReactions>(reactions) : notFound();
}
