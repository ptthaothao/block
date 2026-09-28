"use client";

import { useQuery } from "@tanstack/react-query";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { REACTION_COPY, REACTION_TIMINGS } from "../constants";
import type { PeopleSource } from "../types";
import { peopleLabel } from "../utils/people-label";



type ReactionPeopleTooltipProps = {
  source: PeopleSource | null;
  side?: "top" | "right";
  children: (describedBy: string | undefined) => ReactNode;
};

const SIDES = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
} as const;

/**
 * "Grace, Minh và 10 người khác" on hover or focus. Names are fetched the
 * first time someone hovers, never ahead of time.
 */
export function ReactionPeopleTooltip({ source, side = "top", children }: ReactionPeopleTooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const people = useQuery({
    queryKey: source?.queryKey ?? ["reactions", "people", "none"],
    queryFn: () => source!.fetch(),
    enabled: open && source !== null,
    staleTime: REACTION_TIMINGS.peopleStaleMs,
  });

  if (!source) return <>{children(undefined)}</>;

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children(open ? id : undefined)}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-30 w-max max-w-56 rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-xs text-muted shadow-popover",
            SIDES[side],
          )}
        >
          {people.data ? peopleLabel(people.data) : REACTION_COPY.peopleLoading}
        </span>
      )}
    </span>
  );
}
