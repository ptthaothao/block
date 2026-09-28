"use client";

import { useState, type ReactNode } from "react";

import { Tabs } from "@/components/ui/tabs";
import { PostGridSkeleton } from "@/features/posts/components/post-grid-skeleton";

import { FEED_TABS, INTEREST_COPY, INTEREST_LIMITS } from "../constants";
import { useFeedTab } from "../hooks/use-feed-tab";
import { useInterests } from "../hooks/use-interests";
import type { InterestItem } from "../types";
import { hasFollows, interestsSignature } from "../utils/interest-state";
import { ForYouFeed } from "./for-you-feed";
import { InterestInvite } from "./interest-invite";

/**
 * "Dành cho bạn | Mới nhất" on the home page. "Mới nhất" is rendered on the
 * server (so the page works and is indexed without JS); "Dành cho bạn" is
 * fetched in the browser. Readers who follow something land on it by default.
 */
export function HomeFeed({ latest }: { latest: ReactNode }) {
  const { ready, signedIn, items } = useInterests();
  const [picked, pick] = useFeedTab();
  // The interests the feed was built from. Following or muting while reading
  // doesn't reshuffle the cards; the reader can refresh on purpose.
  const [snapshot, setSnapshot] = useState<InterestItem[] | null>(null);
  if (ready && snapshot === null) setSnapshot(items);

  const follows = ready && hasFollows(items);
  const tab = picked ?? (follows ? "for-you" : "latest");
  const changed = snapshot !== null && interestsSignature(snapshot) !== interestsSignature(items);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <Tabs tabs={FEED_TABS} value={tab} onChange={pick} label={INTEREST_COPY.feedTabsLabel} />
        {tab === "for-you" && changed && (
          <button
            type="button"
            onClick={() => setSnapshot(items)}
            className="pb-2.5 text-sm font-medium text-accent hover:text-accent-hover"
          >
            {INTEREST_COPY.refreshFeed}
          </button>
        )}
      </div>
      {ready && !follows && <InterestInvite />}
      {tab === "latest" ? (
        latest
      ) : snapshot === null ? (
        <PostGridSkeleton count={INTEREST_LIMITS.feedPage} />
      ) : (
        <ForYouFeed interests={snapshot} signedIn={signedIn} />
      )}
    </div>
  );
}
