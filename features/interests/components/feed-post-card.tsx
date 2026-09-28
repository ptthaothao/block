"use client";

import { EyeOff, Plus } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { PostCard } from "@/features/posts/components/post-card";

import { INTEREST_COPY } from "../constants";
import { useInterests } from "../hooks/use-interests";
import type { FeedItem } from "../types";
import { interestLabel, muteTargetOf, reasonLabel } from "../utils/feed-card";
import { weightOf } from "../utils/interest-state";

const MENU_ICON_CLASS = "size-4";

/**
 * A post in "Dành cho bạn": says why it was picked and offers "Quan tâm …" /
 * "Ít nội dung như thế này hơn". Muting collapses the card in place with an
 * undo, so the reader sees the effect right where they acted.
 */
export function FeedPostCard({ item }: { item: FeedItem }) {
  const { post, reason } = item;
  const { ready, items, change } = useInterests();
  const [muted, setMuted] = useState(false);
  const target = muteTargetOf(post);

  if (muted && target) {
    return (
      <Card className="flex min-h-40 flex-col items-center justify-center gap-3 border-dashed p-6 text-center">
        <p className="text-sm text-muted">{INTEREST_COPY.mutedToast(interestLabel(target.type, target.name))}</p>
        <button
          type="button"
          onClick={async () => {
            setMuted(false);
            if (!(await change({ ...target, weight: 0 }))) setMuted(true);
          }}
          className="text-sm font-semibold text-accent hover:text-accent-hover"
        >
          {INTEREST_COPY.undo}
        </button>
      </Card>
    );
  }

  const menuItems: MenuItem[] = [];
  if (ready && target) {
    const label = interestLabel(target.type, target.name);
    if (weightOf(items, target.type, target.slug) !== 1) {
      menuItems.push({
        id: "follow",
        label: INTEREST_COPY.followLabel(label),
        icon: <Plus aria-hidden className={MENU_ICON_CLASS} />,
        onSelect: () => void change({ ...target, weight: 1 }),
      });
    }
    menuItems.push({
      id: "mute",
      label: INTEREST_COPY.lessLikeThis,
      icon: <EyeOff aria-hidden className={MENU_ICON_CLASS} />,
      onSelect: async () => {
        setMuted(true);
        if (!(await change({ ...target, weight: -1 }))) setMuted(false);
      },
    });
  }

  return (
    <PostCard
      post={post}
      reason={reason ? INTEREST_COPY.reason(reasonLabel(reason)) : undefined}
      menu={menuItems.length > 0 ? <Menu label={INTEREST_COPY.menuLabel(post.title)} items={menuItems} /> : undefined}
    />
  );
}
