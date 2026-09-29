"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  // Sign-in/sign-out land here via a Server Action `redirect()`, which
  // navigates client-side without remounting the query client: the cached
  // "signed out" (or signed-in) answer would otherwise stick until the next
  // window focus. A changed path is the one signal every such redirect shares.
  useEffect(() => {
    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    }
  }, [pathname, queryClient]);

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
