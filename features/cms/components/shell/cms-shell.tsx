"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import type { PublicSessionUser } from "@/features/auth/types";

import { CMS_SHELL_COPY } from "../../constants";
import { useCmsNav } from "../../hooks/use-cms-nav";
import { useSidebarCollapsed } from "../../hooks/use-sidebar-collapsed";
import { isFullBleedPath } from "../../utils/full-bleed-path";
import { CmsSidebar } from "./cms-sidebar";
import { CmsTopbar } from "./cms-topbar";

/** Sidebar + topbar app shell for /cms; on desktop the sidebar collapses to an icon rail, on phones it moves into a drawer. */
export function CmsShell({ user, children }: { user: PublicSessionUser; children: ReactNode }) {
  const { entries, active, activeLink } = useCmsNav(user.role);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const closeMenu = () => setMenuOpen(false);
  // The post editor and review queue are full-bleed workspaces; every other page sits in a centered column.
  const fullBleed = isFullBleedPath(usePathname());

  return (
    <div className="flex min-h-dvh">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-r border-border bg-surface-sunken transition-[width] duration-200 motion-reduce:transition-none lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <CmsSidebar user={user} entries={entries} active={active} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </aside>

      <Sheet open={menuOpen} onClose={closeMenu} title={CMS_SHELL_COPY.menuTitle} variant="side">
        <CmsSidebar user={user} entries={entries} active={active} showBrand={false} onNavigate={closeMenu} />
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <CmsTopbar section={activeLink?.label ?? null} onOpenMenu={() => setMenuOpen(true)} />
        <main id={MAIN_CONTENT_ID} className={cn("flex-1", !fullBleed && "px-4 py-8 sm:px-6 lg:px-8")}>
          {fullBleed ? children : <div className="mx-auto max-w-6xl">{children}</div>}
        </main>
      </div>
    </div>
  );
}
