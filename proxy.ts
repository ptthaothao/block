import { NextResponse, type NextRequest } from "next/server";

import { PROTECTED_ROUTE_PREFIXES } from "@/config/routes";
import { buildLoginPath } from "@/features/auth/utils/login-url";
import { updateSession } from "@/lib/supabase/proxy";

function isProtected(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);

  const { pathname } = request.nextUrl;
  if (!userId && isProtected(pathname)) {
    return NextResponse.redirect(new URL(buildLoginPath({ next: pathname }), request.url));
  }

  return response;
}

// Only session-aware routes run the proxy, so public pages stay static (ISR).
// Next.js requires this matcher to be a literal; keep it in sync with ROUTES.
export const config = {
  matcher: ["/cms/:path*", "/me/:path*", "/auth/:path*", "/api/:path*", "/login"],
};
