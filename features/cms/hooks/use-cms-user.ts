"use client";

import { useContext } from "react";

import { CmsUserContext } from "../components/cms-user-provider";

/** The signed-in user inside /cms (the layout guarantees one). */
export function useCmsUser() {
  const user = useContext(CmsUserContext);
  if (!user) throw new Error("useCmsUser must be used inside CmsUserProvider");
  return user;
}
