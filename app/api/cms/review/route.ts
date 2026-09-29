import { authorize } from "@/features/auth/guards";
import { listReviewPosts } from "@/features/cms/queries";
import { forbidden, jsonNoStore } from "@/lib/http/api-response";

export async function GET() {
  if (!(await authorize("editor"))) return forbidden();
  return jsonNoStore(await listReviewPosts());
}
