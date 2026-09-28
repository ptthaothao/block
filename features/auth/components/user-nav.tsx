"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { useSessionUser } from "../hooks/use-session-user";

export function UserNav() {
  const user = useSessionUser();

  if (user === undefined) return <span className="h-9 w-24" aria-hidden />;

  if (!user) {
    return (
      <ButtonLink href={ROUTES.login} size="sm" className="whitespace-nowrap">
        Đăng nhập
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted sm:inline">{user.displayName}</span>
      <Avatar name={user.displayName} src={user.avatarUrl} size="md" />
      <form action={ROUTES.signOut} method="post">
        <Button type="submit" variant="ghost" className="text-sm font-normal">
          Đăng xuất
        </Button>
      </form>
    </div>
  );
}
