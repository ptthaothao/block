"use client";

import { MessageSquare, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LoginModal } from "@/features/auth/components/login-modal";
import { useLongPress } from "@/lib/hooks/use-long-press";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils/cn";

import { MOBILE_BAR_TOP_OFFSET_PX, POST_ANCHORS, QUICK_REACTION, REACTION_COPY, REACTION_TIMINGS, REACTIONS } from "../constants";
import { usePostReactions } from "../hooks/use-post-reactions";
import { reactionMeta, totalReactions } from "../utils/reaction-state";
import { reactionReturnPath } from "../utils/return-path";
import { ReactionButton } from "./reaction-button";

/**
 * Phones and tablets: a bar at the bottom that shows when the reader scrolls
 * up and hides when they scroll down. Tap = 👍, hold = pick another emoji.
 */
export function ReactionMobileBar({ slug }: { slug: string }) {
  const { data, toggle, popped, loginOpen, closeLogin } = usePostReactions(slug);
  const direction = useScrollDirection(MOBILE_BAR_TOP_OFFSET_PX);
  const [pickerOpen, setPickerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = direction === "up" || pickerOpen || loginOpen;

  const quick = data?.mine[0] ?? QUICK_REACTION;
  const quickMine = data?.mine.includes(quick) ?? false;
  const press = useLongPress({
    onTap: () => toggle(quick),
    onLongPress: () => setPickerOpen(true),
    delayMs: REACTION_TIMINGS.longPressMs,
  });

  useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPickerOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPickerOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur transition-transform duration-200 motion-reduce:transition-none lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      inert={!visible}
    >
      {pickerOpen && data && (
        <div
          role="group"
          aria-label={REACTION_COPY.pickerLabel}
          className="absolute bottom-full left-4 mb-2 flex gap-1 rounded-full border border-border-strong bg-surface p-1.5 shadow-popover motion-safe:animate-[sheet-in_150ms_ease-out]"
        >
          {REACTIONS.map((r) => (
            <ReactionButton
              key={r.kind}
              kind={r.kind}
              count={data.counts[r.kind] ?? 0}
              mine={data.mine.includes(r.kind)}
              popped={popped === r.kind}
              onToggle={(kind) => {
                toggle(kind);
                setPickerOpen(false);
              }}
              variant="chip"
            />
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2">
        <button
          type="button"
          aria-pressed={quickMine}
          aria-label={REACTION_COPY.buttonLabel(reactionMeta(quick).label, data?.counts[quick] ?? 0, quickMine)}
          {...press}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium tabular-nums transition select-none [-webkit-touch-callout:none]",
            quickMine ? "border-accent/60 bg-accent/15 text-accent" : "border-border bg-surface text-muted",
          )}
        >
          <span aria-hidden className={cn("text-lg", popped === quick && "motion-safe:animate-[reaction-pop_150ms_ease-out]")}>
            {reactionMeta(quick).emoji}
          </span>
          {data ? totalReactions(data.counts) : 0}
        </button>
        <button
          type="button"
          aria-label={REACTION_COPY.moreReactions}
          aria-expanded={pickerOpen}
          onClick={() => setPickerOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition hover:text-text"
        >
          <SmilePlus aria-hidden className="size-5" />
        </button>
        <a
          href={`#${POST_ANCHORS.comments}`}
          aria-label={REACTION_COPY.goToComments}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-muted tabular-nums transition hover:text-text"
        >
          <MessageSquare aria-hidden className="size-4" />
          {data?.commentCount ?? 0}
        </a>
      </div>
      <LoginModal open={loginOpen} onClose={closeLogin} next={reactionReturnPath(slug)} reason={REACTION_COPY.loginReason} />
    </div>
  );
}
