import { getCommentReplies } from "@/features/comments/queries";
import { commentIdSchema } from "@/features/comments/schemas";
import type { CommentReplies } from "@/features/comments/types";
import { badRequest, jsonNoStore, notFound } from "@/lib/http/api-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/comments/[id]/replies">) {
  const id = commentIdSchema.safeParse((await params).id);
  if (!id.success) return badRequest();
  const replies = await getCommentReplies(id.data);
  return replies ? jsonNoStore<CommentReplies>({ replies }) : notFound();
}
