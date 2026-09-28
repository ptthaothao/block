import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

type EyebrowProps = ComponentProps<"p"> & { as?: "p" | "h2" | "h3" };

/** Small monospace caption above a heading, e.g. "MỚI RA LÒ". Use `as="h2"` when it titles a section. */
export function Eyebrow({ as: Tag = "p", className, ...props }: EyebrowProps) {
  return <Tag className={cn("font-mono text-xs uppercase tracking-wider text-faint", className)} {...props} />;
}
