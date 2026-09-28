"use client";

import { Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { INTEREST_COPY } from "../constants";
import { useInterests } from "../hooks/use-interests";
import type { InterestType } from "../types";
import { interestLabel } from "../utils/feed-card";
import { weightOf } from "../utils/interest-state";

type FollowButtonProps = {
  type: InterestType;
  slug: string;
  name: string;
  color?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: "min-h-8 px-3 text-xs",
  md: "min-h-10 px-4 text-sm",
} as const;

/**
 * "Quan tâm" / "Đang quan tâm" toggle. Works for visitors too (saved in this
 * browser); the label flips instantly and rolls back if saving fails.
 */
export function FollowButton({ type, slug, name, color, avatarUrl, size = "md", className }: FollowButtonProps) {
  const { ready, items, change } = useInterests();
  const following = weightOf(items, type, slug) === 1;
  const isAuthor = type === "author";
  const label = following
    ? isAuthor
      ? INTEREST_COPY.followingAuthor
      : INTEREST_COPY.following
    : isAuthor
      ? INTEREST_COPY.followAuthor
      : INTEREST_COPY.follow;
  const Icon = following ? Check : Plus;

  return (
    <button
      type="button"
      disabled={!ready}
      aria-pressed={ready ? following : undefined}
      aria-label={(following ? INTEREST_COPY.unfollowLabel : INTEREST_COPY.followLabel)(interestLabel(type, name))}
      onClick={() => change({ type, slug, name, color, avatarUrl, weight: following ? 0 : 1 })}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition",
        "disabled:cursor-wait disabled:opacity-60",
        following
          ? "border-accent/40 bg-accent/15 text-accent hover:bg-accent/25"
          : "border-border-strong bg-surface text-text hover:border-accent hover:text-accent",
        SIZES[size],
        className,
      )}
    >
      <Icon aria-hidden className={size === "sm" ? "size-3.5" : "size-4"} />
      {label}
    </button>
  );
}
