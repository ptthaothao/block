import { authorize } from "@/features/auth/guards";
import { getCmsTaxonomy } from "@/features/cms/queries";
import { forbidden, jsonNoStore } from "@/lib/http/api-response";

/** Authors need it for the editor's pickers; only editors can change it. */
export async function GET() {
  if (!(await authorize("author"))) return forbidden();
  return jsonNoStore(await getCmsTaxonomy());
}
