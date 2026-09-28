import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireSupabaseEnv } from "@/lib/env";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import type { Database } from "@/types/database";

/**
 * Per-request client acting as the signed-in user (RLS applies). Use in
 * Server Components, Server Actions and Route Handlers that need the session.
 * Reading cookies makes the route dynamic, so never use it on cached public
 * pages; use getPublicClient() there.
 */
export async function createClient() {
  // Read cookies first: it marks the route dynamic, so a build without
  // Supabase env (CI) skips prerendering it instead of failing on the env check.
  const cookieStore = await cookies();
  const { url, key } = requireSupabaseEnv();

  return createServerClient<Database>(url, key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
