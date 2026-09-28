import "server-only";

import { ROUTES } from "@/config/routes";

import { getSessionUser } from "../queries";
import { hasRole } from "./roles";

/**
 * Where to land the signed-in user. An explicit `next` (e.g. the post they
 * were reacting to) always wins, so a pending action can resume there; staff
 * who just opened /login land on /dashboard.
 */
export async function postLoginDestination(next: string): Promise<string> {
  if (next !== ROUTES.home) return next;
  const user = await getSessionUser();
  return user && hasRole(user.role, "author") ? ROUTES.dashboard : next;
}
