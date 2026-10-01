"use client";

import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { useRef } from "react";

import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { ROUTES } from "@/config/routes";

import { USER_NAV_COPY } from "../constants";
import { useSessionUser } from "../hooks/use-session-user";
import { hasRole } from "../utils/roles";

const ICON_CLASS = "size-4";

export function UserNav() {
  const user = useSessionUser();
  const signOutForm = useRef<HTMLFormElement>(null);

  if (user === undefined) return <span className="h-9 w-24" aria-hidden />;

  if (!user) {
    return (
      <ButtonLink href={ROUTES.login} size="sm" className="whitespace-nowrap">
        {USER_NAV_COPY.signIn}
      </ButtonLink>
    );
  }

  const items: MenuItem[] = [
    { id: "interests", label: USER_NAV_COPY.interests, href: ROUTES.meInterests, icon: <Sparkles className={ICON_CLASS} /> },
    ...(hasRole(user.role, "author")
      ? [{ id: "dashboard", label: USER_NAV_COPY.dashboard, href: ROUTES.cms, icon: <LayoutDashboard className={ICON_CLASS} /> }]
      : []),
    { id: "sign-out", label: USER_NAV_COPY.signOut, onSelect: () => signOutForm.current?.requestSubmit(), icon: <LogOut className={ICON_CLASS} /> },
  ];

  return (
    <>
      <Menu
        label={USER_NAV_COPY.menuLabel(user.displayName)}
        items={items}
        triggerClassName="flex items-center gap-3 rounded-full py-0.5 pr-0.5 pl-3 text-sm text-muted transition hover:text-text aria-expanded:text-text max-sm:pl-0.5"
        trigger={
          <>
            <span className="max-sm:sr-only">{user.displayName}</span>
            <Avatar name={user.displayName} src={user.avatarUrl} size="md" />
          </>
        }
      />
      <form ref={signOutForm} action={ROUTES.signOut} method="post" hidden />
    </>
  );
}
