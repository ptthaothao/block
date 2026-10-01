import "server-only";

import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";

import { getSessionUser } from "./queries";
import type { Role, SessionUser } from "./types";
import { buildLoginPath } from "./utils/login-url";
import { hasRole } from "./utils/roles";

/** For layouts and pages: redirect when the user lacks the role. */
export async function requireRole(min: Role, next: string = ROUTES.cms): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(buildLoginPath({ next }));
  if (!hasRole(user.role, min)) redirect(ROUTES.home);
  return user;
}

/** For Server Actions and Route Handlers: null when not allowed. */
export async function authorize(min: Role): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && hasRole(user.role, min) ? user : null;
}
