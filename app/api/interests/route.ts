import { getSessionUser } from "@/features/auth/queries";
import { getMyInterests } from "@/features/interests/queries";
import type { InterestsResponse } from "@/features/interests/types";
import { jsonNoStore, unauthorized } from "@/lib/http/api-response";

export async function GET() {
  if (!(await getSessionUser())) return unauthorized();
  return jsonNoStore<InterestsResponse>({ items: await getMyInterests() });
}
