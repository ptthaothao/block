import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { VERIFIED_USER_ID_HEADER } from "@/lib/supabase/proxy";

import { toSessionUser } from "./mappers";
import type { SessionUser } from "./types";

export const PROFILE_SESSION_SELECT = "id, username, display_name, avatar_url, role" as const;

/**
 * The signed-in user's profile, at most once per request.
 *
 * Throws if Supabase is not configured (via createClient()), rather than
 * pretending the visitor is signed out: every caller runs at request time on
 * a session-aware route (see proxy.ts's matcher), so silently returning null
 * here previously made a misconfigured server look like an infinite login
 * redirect instead of a clear server error.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();

  // The proxy already verified this request's JWT (it runs on every
  // session-aware route, see proxy.ts's matcher); reuse that instead of
  // calling getClaims() again when the header is present.
  const forwardedUserId = (await headers()).get(VERIFIED_USER_ID_HEADER);
  const userId = forwardedUserId ?? (await supabase.auth.getClaims()).data?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_SESSION_SELECT)
    .eq("id", userId)
    .maybeSingle();
  return profile ? toSessionUser(profile) : null;
});

/** When the signed-in user's profile was created, or null when signed out. */
export async function getAccountCreatedAt(userId: string): Promise<Date | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("created_at").eq("id", userId).maybeSingle();
  return data ? new Date(data.created_at) : null;
}
