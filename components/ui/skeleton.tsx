import { cn } from "@/lib/utils/cn";

/** Grey placeholder block. Give it the size of the content it stands in for so nothing jumps when data arrives. */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block rounded-md bg-surface-hover motion-safe:animate-pulse", className)} />;
}
