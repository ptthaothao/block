import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { readSupabaseEnv } from "@/lib/env-keys";
import type { Database } from "@/types/database";

import { authCookieOptions } from "./cookie-options";

/**
 * Internal-only request header carrying the JWT-verified user id from the
 * proxy, so server code handling the same request can skip re-verifying it.
 * Never trust this header outside of code reading it from `headers()` in a
 * request the proxy actually ran on (see the matcher in proxy.ts).
 */
export const VERIFIED_USER_ID_HEADER = "x-verified-user-id";

/**
 * Refreshes the Supabase session cookie on requests that need a session and
 * returns the signed-in user id (or null). Runs in proxy.ts only.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = readSupabaseEnv();
  if (!env) return { response, userId: null };

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // getClaims() verifies the JWT and refreshes an expired session.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;

  // Forward the already-verified user id to the server-rendered request (not
  // just the response) so downstream code can skip re-verifying the JWT.
  if (userId) {
    request.headers.set(VERIFIED_USER_ID_HEADER, userId);
    response = NextResponse.next({ request });
  }

  return { response, userId };
}
