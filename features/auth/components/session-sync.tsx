"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SESSION_QUERY_KEY } from "../constants";
import type { SessionQueryData } from "../types";
import { readAuthMarker } from "../utils/read-auth-marker";

/**
 * Mounted once, app-wide. Sign-in lands via a Server Action `redirect()`
 * (client navigation, same query client) and other tabs share the cookie, so
 * on every navigation and every return to the tab we compare the auth marker
 * with the one the cached session was fetched under, and refetch /api/me only
 * when it changed. Nothing is requested otherwise.
 */
export function SessionSync() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    const refetchIfChanged = () => {
      const cached = queryClient.getQueryData<SessionQueryData>(SESSION_QUERY_KEY);
      if (cached && cached.marker !== readAuthMarker()) {
        void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refetchIfChanged();
    };

    refetchIfChanged();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pathname, queryClient]);

  return null;
}
