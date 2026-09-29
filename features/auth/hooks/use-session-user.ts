"use client";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "../api";
import { SESSION_QUERY_KEY, SESSION_STALE_TIME_MS } from "../constants";
import type { PublicSessionUser } from "../types";

/** `undefined` while loading, `null` when signed out. */
export type SessionUserState = PublicSessionUser | null | undefined;

/**
 * Pages are static, so the signed-in user comes from our own API after load.
 * One shared query means the header, reactions, comments and follow buttons
 * all agree, and refetching on tab focus picks up sign-in/sign-out from
 * another tab. The browser never talks to Supabase.
 */
export function useSessionUser(): SessionUserState {
  const { data, isError } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: authApi.me,
    staleTime: SESSION_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    select: (body) => body.user,
  });
  if (isError) return null;
  return data;
}
