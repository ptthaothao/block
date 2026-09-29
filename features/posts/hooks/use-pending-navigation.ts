"use client";

import { createContext, useContext } from "react";

export type PendingNavigation = {
  /** Navigate inside a transition so the current results stay on screen (dimmed) until the new ones arrive. */
  navigate: (href: string) => void;
  isPending: boolean;
};

export const PendingNavigationContext = createContext<PendingNavigation | null>(null);

/** Null outside a PendingNavigationProvider: callers then fall back to a plain link. */
export function usePendingNavigation(): PendingNavigation | null {
  return useContext(PendingNavigationContext);
}
