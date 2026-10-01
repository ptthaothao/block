import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Thin caption bar on top of the markdown and preview panes. */
export function PaneHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b border-editor-line/50 pt-1.5 pb-[7px] font-mono text-[11px] leading-[16.5px] text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}
