import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/** Visual checkbox for list options that are links or buttons (state is announced by the parent). */
export function CheckboxMark({ checked, round = false }: { checked: boolean; round?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center border transition",
        round ? "rounded-full" : "rounded-sm",
        checked ? "border-accent bg-accent text-canvas" : "border-border-strong bg-surface-sunken",
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </span>
  );
}
