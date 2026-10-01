import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import { ROLE_LABELS } from "@/features/auth/constants";
import type { PublicSessionUser } from "@/features/auth/types";

type CmsUserCardProps = { user: PublicSessionUser; collapsed?: boolean };

export function CmsUserCard({ user, collapsed = false }: CmsUserCardProps) {
  return (
    <div
      className={cn("flex items-center gap-3 py-2", collapsed ? "justify-center px-0" : "px-3")}
      title={collapsed ? user.displayName : undefined}
    >
      <Avatar name={user.displayName} src={user.avatarUrl} size="md" />
      <div className={cn("min-w-0", collapsed && "sr-only")}>
        <p className="truncate text-sm font-medium text-text">{user.displayName}</p>
        <p className="font-mono text-xs text-faint">{ROLE_LABELS[user.role]}</p>
      </div>
    </div>
  );
}
