import Link from "next/link";

import type { CmsNavLink as CmsNavLinkItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

type CmsNavLinkProps = {
  link: CmsNavLinkItem;
  active: boolean;
  /** Children of a group sit under the group's icon, so they get a dot instead. */
  nested?: boolean;
  /** Icon rail: the label stays for screen readers and shows as a tooltip. */
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function CmsNavLink({ link, active, nested = false, collapsed = false, onNavigate }: CmsNavLinkProps) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? link.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md py-2 text-sm font-medium transition",
        collapsed ? "justify-center px-0" : "px-3",
        nested && "pl-10",
        active ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface-hover hover:text-text",
      )}
    >
      {Icon && <Icon aria-hidden className="size-4 shrink-0" />}
      {nested && <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-accent" : "bg-border-strong")} />}
      <span className={cn("truncate", collapsed && "sr-only")}>{link.label}</span>
    </Link>
  );
}
