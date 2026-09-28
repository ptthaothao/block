"use client";

import { useEffect, useState } from "react";

import { ROUTES } from "@/config/routes";

import type { MeResponse, PublicSessionUser } from "../types";

/** `undefined` while loading, `null` when signed out. */
export type SessionUserState = PublicSessionUser | null | undefined;

/**
 * Pages are static, so the signed-in user is fetched from our own API once
 * after load, then refetched on tab focus to pick up sign-in/sign-out from
 * another tab. Sign-in/sign-out in this tab redirect to a different path,
 * which remounts this component and refetches anyway. The browser never
 * talks to Supabase.
 */
export function useSessionUser(): SessionUserState {
  const [user, setUser] = useState<SessionUserState>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    function load() {
      fetch(ROUTES.apiMe, { signal: controller.signal, credentials: "same-origin" })
        .then((res) => (res.ok ? (res.json() as Promise<MeResponse>) : { user: null }))
        .then((body) => setUser(body.user))
        .catch(() => {
          if (!controller.signal.aborted) setUser(null);
        });
    }

    load();
    window.addEventListener("focus", load);
    return () => {
      controller.abort();
      window.removeEventListener("focus", load);
    };
  }, []);

  return user;
}
