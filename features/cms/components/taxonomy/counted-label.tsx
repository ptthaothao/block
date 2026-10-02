import type { ReactNode } from "react";

import { Label } from "@/components/ui/input";

type CountedLabelProps = {
  htmlFor: string;
  children: ReactNode;
  /** Shown as "length/max" on the right. */
  count?: { length: number; max: number };
  /** Anything else on the right, e.g. a small action. */
  action?: ReactNode;
};

/** Form label with a character counter or an action on the right. */
export function CountedLabel({ htmlFor, children, count, action }: CountedLabelProps) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <Label htmlFor={htmlFor}>{children}</Label>
      {count && (
        <span className="font-mono text-[11px] text-faint" aria-hidden>
          {count.length}/{count.max}
        </span>
      )}
      {action}
    </div>
  );
}
