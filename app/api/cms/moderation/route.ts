import { authorize } from "@/features/auth/guards";
import { getModerationQueue } from "@/features/comments/queries";
import { forbidden, jsonNoStore } from "@/lib/http/api-response";

export async function GET() {
  if (!(await authorize("editor"))) return forbidden();
  return jsonNoStore({ items: await getModerationQueue() });
}
