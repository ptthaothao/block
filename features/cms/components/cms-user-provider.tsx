"use client";

import { createContext, type ReactNode } from "react";

import type { PublicSessionUser } from "@/features/auth/types";

export const CmsUserContext = createContext<PublicSessionUser | null>(null);

export function CmsUserProvider({ user, children }: { user: PublicSessionUser; children: ReactNode }) {
  return <CmsUserContext.Provider value={user}>{children}</CmsUserContext.Provider>;
}
