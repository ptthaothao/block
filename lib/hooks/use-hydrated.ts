"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and while hydrating, true afterwards. Gate UI that
 * depends on client-only state (a cached query, storage) with it: a segment
 * that hydrates late (behind Suspense) would otherwise see data the server
 * HTML didn't have and mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
