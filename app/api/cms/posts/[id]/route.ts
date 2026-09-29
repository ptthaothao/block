import { authorize } from "@/features/auth/guards";
import { getCmsPost } from "@/features/cms/queries";
import { postIdSchema } from "@/features/cms/schemas";
import { forbidden, jsonNoStore, notFound } from "@/lib/http/api-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/cms/posts/[id]">) {
  const user = await authorize("author");
  if (!user) return forbidden();

  const { id } = await params;
  if (!postIdSchema.safeParse(id).success) return notFound();

  const post = await getCmsPost(user, id);
  return post ? jsonNoStore(post) : notFound();
}
