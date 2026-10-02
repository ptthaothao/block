"use client";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "../api";
import { SESSION_QUERY_KEY } from "../constants";
import type { PublicSessionUser, SessionQueryData } from "../types";
import { readAuthMarker } from "../utils/read-auth-marker";

/** `undefined` while loading, `null` when signed out. */
export type SessionUserState = PublicSessionUser | null | undefined;

const fetchSession = async (): Promise<SessionQueryData> => {
  // Read before the request: if a sign-in lands mid-flight, the next check
  // sees a newer marker and refetches, never the other way round.
  const marker = readAuthMarker();
  return { ...(await authApi.me()), marker };
};

/**
 * Pages are static, so the signed-in user comes from our own API after load.
 * One shared query means the header, reactions, comments and follow buttons
 * all agree. It is fetched once and kept: SessionSync refetches it only when
 * the auth marker cookie says this browser signed in or out. The browser
 * never talks to Supabase.
 */
export function useSessionUser(): SessionUserState {
  const { data, isError } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    select: (body) => body.user,
  });
  if (isError) return null;
  return data;
}
