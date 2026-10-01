import "server-only";

import { ROUTES } from "@/config/routes";

import { getAccountCreatedAt, getSessionUser } from "../queries";
import { isNewAccount } from "./is-new-account";
import { hasRole } from "./roles";

/**
 * Where to land the signed-in user. An explicit `next` (e.g. the post they
 * were reacting to) always wins, so a pending action can resume there; staff
 * who just opened /login land on /cms, and brand-new readers on
 * onboarding to pick what they want to read.
 */
export async function postLoginDestination(next: string): Promise<string> {
  if (next !== ROUTES.home) return next;
  const user = await getSessionUser();
  if (!user) return next;
  if (hasRole(user.role, "author")) return ROUTES.cms;
  return isNewAccount(await getAccountCreatedAt(user.id)) ? ROUTES.onboarding : next;
}
