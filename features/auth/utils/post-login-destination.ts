import "server-only";

import { ROUTES } from "@/config/routes";

import { getSessionUser } from "../queries";
import { hasRole } from "./roles";

/** Where to land the signed-in user: /dashboard for staff, `next` otherwise. */
export async function postLoginDestination(next: string): Promise<string> {
  const user = await getSessionUser();
  return user && hasRole(user.role, "author") ? ROUTES.dashboard : next;
}
