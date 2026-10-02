import { NextResponse, type NextRequest } from "next/server";

import { PROTECTED_ROUTE_PREFIXES } from "@/config/routes";
import { AUTH_MARKER_COOKIE } from "@/features/auth/constants";
import { buildLoginPath } from "@/features/auth/utils/login-url";
import { updateSession } from "@/lib/supabase/proxy";

function isProtected(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const result =
    !userId && isProtected(pathname)
      ? NextResponse.redirect(new URL(buildLoginPath({ next: pathname }), request.url))
      : response;

  // The session ended without a sign-out (expired or revoked): drop the marker
  // so open tabs notice and refetch /api/me once.
  if (!userId && request.cookies.has(AUTH_MARKER_COOKIE)) result.cookies.delete(AUTH_MARKER_COOKIE);

  return result;
}

// Only session-aware routes run the proxy, so public pages stay static (ISR).
// Next.js requires this matcher to be a literal; keep it in sync with ROUTES.
export const config = {
  matcher: ["/cms/:path*", "/me/:path*", "/auth/:path*", "/api/:path*", "/login"],
};
