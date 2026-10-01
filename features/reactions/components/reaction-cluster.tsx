"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CLUSTER_ICON_LIMIT, REACTION_COPY, REACTION_TIMINGS } from "../constants";
import type { ReactionCounts } from "../types";
import { rankedReactions, totalReactions } from "../utils/reaction-state";

type PointerKind = "mouse" | "touch" | "key";

/**
 * Up to three overlapping emoji for what a comment got, plus the total. Counts per
 * emoji show only on hover (after a short delay), tap or keyboard focus.
 */
export function ReactionCluster({ counts }: { counts: ReactionCounts }) {
  const tooltipId = useId();
  const [shown, setShown] = useState(false);
  const delay = useRef<ReturnType<typeof setTimeout>>(undefined);
  const root = useRef<HTMLSpanElement>(null);
  const lastInput = useRef<PointerKind>("key");
  const ranked = rankedReactions(counts);
  const total = totalReactions(counts);

  useEffect(() => () => clearTimeout(delay.current), []);
  useEffect(() => {
    if (!shown) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setShown(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [shown]);

  if (ranked.length === 0) return null;

  return (
    <span
      ref={root}
      className="relative inline-flex"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        delay.current = setTimeout(() => setShown(true), REACTION_TIMINGS.breakdownDelayMs);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        clearTimeout(delay.current);
        setShown(false);
      }}
    >
      <button
        type="button"
        aria-label={REACTION_COPY.clusterLabel(total)}
        aria-describedby={shown ? tooltipId : undefined}
        aria-expanded={shown}
        onPointerDown={(event) => (lastInput.current = event.pointerType === "mouse" ? "mouse" : "touch")}
        onKeyDown={() => (lastInput.current = "key")}
        onFocus={(event) => event.currentTarget.matches(":focus-visible") && setShown(true)}
        onBlur={() => setShown(false)}
        onClick={() => setShown((open) => (lastInput.current === "mouse" ? true : !open))}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-1.5 text-xs font-medium tabular-nums text-muted transition hover:bg-surface-hover"
      >
        <span aria-hidden className="flex">
          {ranked.slice(0, CLUSTER_ICON_LIMIT).map((r, index) => (
            <span
              key={r.kind}
              style={{ zIndex: CLUSTER_ICON_LIMIT - index }}
              className="-ml-1.5 grid size-5 place-items-center rounded-full bg-surface-hover text-[11px] leading-none ring-2 ring-canvas first:ml-0"
            >
              {r.emoji}
            </span>
          ))}
        </span>
        {total > 1 && <span aria-hidden>{total}</span>}
      </button>
      {shown && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-0 z-20 mb-1 flex min-w-24 flex-col gap-0.5 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text shadow-popover motion-safe:animate-[reaction-picker-in_150ms_ease-out]"
        >
          {ranked.map((r) => (
            <span key={r.kind} className="flex items-center gap-2 whitespace-nowrap tabular-nums">
              <span aria-hidden>{r.emoji}</span>
              <span className="sr-only">{r.label}</span>
              {r.count}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
