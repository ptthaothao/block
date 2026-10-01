"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { CMS_NAV } from "@/config/navigation";
import type { Role } from "@/features/auth/types";

import { activeHref } from "../utils/active-href";
import { navLinks, visibleNav } from "../utils/visible-nav";

/** The sidebar `role` may see and the link the current page belongs to. */
export function useCmsNav(role: Role) {
  const pathname = usePathname();
  const entries = useMemo(() => visibleNav(CMS_NAV, role), [role]);
  const links = useMemo(() => navLinks(entries), [entries]);
  const active = activeHref(pathname, links.map((link) => link.href));

  return { entries, active, activeLink: links.find((link) => link.href === active) ?? null };
}
