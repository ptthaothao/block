"use client";

import { useRouter } from "next/navigation";
import { useMemo, useTransition, type ReactNode } from "react";

import { PendingNavigationContext } from "../../hooks/use-pending-navigation";

export function PendingNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const value = useMemo(
    () => ({ isPending, navigate: (href: string) => startTransition(() => router.push(href, { scroll: false })) }),
    [isPending, router],
  );
  return <PendingNavigationContext.Provider value={value}>{children}</PendingNavigationContext.Provider>;
}
