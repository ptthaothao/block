import { getReactionPeople } from "@/features/reactions/queries";
import { reactionKindSchema } from "@/features/reactions/schemas";
import type { ReactionPeople } from "@/features/reactions/types";
import { badRequest, jsonNoStore, notFound } from "@/lib/http/api-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/posts/[slug]/reactions/[emoji]/people">) {
  const { slug, emoji } = await params;
  const kind = reactionKindSchema.safeParse(emoji);
  if (!kind.success) return badRequest();
  const people = await getReactionPeople({ type: "post", slug }, kind.data);
  return people ? jsonNoStore<ReactionPeople>(people) : notFound();
}
