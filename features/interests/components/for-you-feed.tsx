"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Button, ButtonLink } from "@/components/ui/button";
import { CardGrid } from "@/components/ui/card-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/config/routes";
import { PostGridSkeleton } from "@/features/posts/components/post-grid-skeleton";

import { interestsApi } from "../api";
import { INTEREST_COPY, INTEREST_LIMITS, INTEREST_QUERY_KEYS, INTEREST_TIMINGS } from "../constants";
import type { InterestItem } from "../types";
import { interestsSignature, toFeedInterests } from "../utils/interest-state";
import { FeedPostCard } from "./feed-post-card";

type ForYouFeedProps = {
  /** The interests this feed was built from. Kept fixed while the page is open so cards don't jump. */
  interests: InterestItem[];
  signedIn: boolean;
};

export function ForYouFeed({ interests, signedIn }: ForYouFeedProps) {
  const feed = useInfiniteQuery({
    queryKey: INTEREST_QUERY_KEYS.feed(`${signedIn ? "me" : "guest"}:${interestsSignature(interests)}`),
    // Signed-in readers' interests are read on the server; visitors send theirs.
    queryFn: ({ pageParam }) => interestsApi.feed(pageParam, signedIn ? null : toFeedInterests(interests)),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage ?? undefined,
    staleTime: INTEREST_TIMINGS.feedStaleMs,
  });

  if (feed.isPending) return <PostGridSkeleton count={INTEREST_LIMITS.feedPage} />;

  if (feed.isError) {
    return (
      <EmptyState title={INTEREST_COPY.feedError}>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => feed.refetch()}>
          {INTEREST_COPY.retry}
        </Button>
      </EmptyState>
    );
  }

  const items = feed.data.pages.flatMap((page) => page.items);
  if (items.length === 0) {
    return (
      <EmptyState title={INTEREST_COPY.feedEmpty}>
        <ButtonLink href={ROUTES.onboarding} variant="outline" size="sm" className="mt-3">
          {INTEREST_COPY.addMore}
        </ButtonLink>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-8">
      <CardGrid columns="posts">
        {items.map((item) => (
          <FeedPostCard key={item.post.slug} item={item} />
        ))}
      </CardGrid>
      {feed.isFetchingNextPage && <PostGridSkeleton count={INTEREST_LIMITS.feedPage} />}
      {feed.hasNextPage && !feed.isFetchingNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => feed.fetchNextPage()}>
            {INTEREST_COPY.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}
