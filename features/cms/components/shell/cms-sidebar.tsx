import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import type { CmsNavEntry } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import type { PublicSessionUser } from "@/features/auth/types";

import { CMS_SHELL_COPY } from "../../constants";
import { CmsNav } from "./cms-nav";
import { CmsUserCard } from "./cms-user-card";

type CmsSidebarProps = {
  user: PublicSessionUser;
  entries: CmsNavEntry[];
  active: string | null;
  /** Icon rail: labels hide and groups open the sidebar instead of expanding in place. */
  collapsed?: boolean;
  /** Shows the collapse toggle; the mobile drawer leaves it out. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The mobile drawer has its own title bar, so it skips the brand row. */
  showBrand?: boolean;
  onNavigate?: () => void;
};

export function CmsSidebar({
  user,
  entries,
  active,
  collapsed = false,
  onCollapsedChange,
  showBrand = true,
  onNavigate,
}: CmsSidebarProps) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const toggleLabel = collapsed ? CMS_SHELL_COPY.expandSidebar : CMS_SHELL_COPY.collapseSidebar;

  return (
    <div className="flex h-full flex-col">
      {showBrand && (
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-2 border-b border-border",
            collapsed ? "justify-center px-2" : "px-4",
          )}
        >
          {!collapsed && (
            <>
              <Logo />
              <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                {CMS_SHELL_COPY.brand}
              </span>
            </>
          )}
          {onCollapsedChange && (
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              aria-label={toggleLabel}
              aria-expanded={!collapsed}
              title={toggleLabel}
              className={cn(
                "grid size-9 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text",
                !collapsed && "ml-auto",
              )}
            >
              <ToggleIcon aria-hidden className="size-4" />
            </button>
          )}
        </div>
      )}
      <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain py-4", collapsed ? "px-2" : "px-3")}>
        <CmsNav
          entries={entries}
          active={active}
          collapsed={collapsed}
          onExpand={() => onCollapsedChange?.(false)}
          onNavigate={onNavigate}
        />
      </div>
      <div className="shrink-0 border-t border-border p-2">
        <CmsUserCard user={user} collapsed={collapsed} />
      </div>
    </div>
  );
}
