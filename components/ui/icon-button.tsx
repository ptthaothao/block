import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const TONES = {
  neutral: "text-faint hover:bg-surface-hover hover:text-text",
  accent: "text-faint hover:bg-accent/10 hover:text-accent",
  danger: "text-faint hover:bg-danger/10 hover:text-danger",
} as const;

type IconButtonProps = ComponentProps<"button"> & {
  /** Accessible name; also shown as the tooltip. */
  label: string;
  tone?: keyof typeof TONES;
};

/** Square button holding one icon. */
export function IconButton({ label, tone = "neutral", className, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md transition disabled:pointer-events-none disabled:opacity-40",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
