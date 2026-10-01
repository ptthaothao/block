"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import type { CmsNavGroup as CmsNavGroupItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

import { CmsNavLink } from "./cms-nav-link";

type CmsNavGroupProps = {
  group: CmsNavGroupItem;
  active: string | null;
  /** Icon rail: children have no icons, so clicking the group opens the sidebar on it. */
  collapsed?: boolean;
  onExpand?: () => void;
  onNavigate?: () => void;
};

export function CmsNavGroup({ group, active, collapsed = false, onExpand, onNavigate }: CmsNavGroupProps) {
  const containsActive = group.children.some((child) => child.href === active);
  // Opens itself when the current page is inside; after a manual toggle the reader's choice wins.
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = !collapsed && (toggled ?? containsActive);
  const panelId = useId();
  const Icon = group.icon;
  // On the rail the group stands in for its hidden children, so it carries their highlight.
  const activeTone = collapsed ? "bg-accent/15 text-accent" : "text-text";

  const handleClick = () => {
    if (collapsed) {
      setToggled(true);
      onExpand?.();
      return;
    }
    setToggled(!open);
  };

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        title={collapsed ? group.label : undefined}
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium transition hover:bg-surface-hover hover:text-text",
          collapsed ? "justify-center px-0" : "px-3",
          containsActive ? activeTone : "text-muted",
        )}
      >
        <Icon aria-hidden className="size-4 shrink-0" />
        <span className={cn("flex-1 truncate text-left", collapsed && "sr-only")}>{group.label}</span>
        {!collapsed && (
          <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
        )}
      </button>
      <div id={panelId} hidden={!open} className="mt-1 space-y-1">
        {group.children.map((child) => (
          <CmsNavLink key={child.href} link={child} active={child.href === active} nested onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
