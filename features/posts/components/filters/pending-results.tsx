"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { usePendingNavigation } from "../../hooks/use-pending-navigation";

/** Dims the results while a filter change loads, instead of blanking them. */
export function PendingResults({ children }: { children: ReactNode }) {
  const pending = usePendingNavigation()?.isPending ?? false;
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-150", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}
