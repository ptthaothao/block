import type { PostSummary } from "@/features/posts/types";
import type { Enums } from "@/types/database";

export type InterestType = Enums<"interest_target">;

/** +1 follow, -1 "ít nội dung như thế này hơn". */
export type InterestWeight = 1 | -1;

/** One followed or muted topic, tag or author, as the browser sees it. */
export type InterestItem = {
  type: InterestType;
  slug: string;
  name: string;
  weight: InterestWeight;
  color: string | null;
  avatarUrl: string | null;
};

export type InterestsResponse = { items: InterestItem[] };

/** A change to one interest; weight 0 removes it. */
export type InterestChange = {
  type: InterestType;
  slug: string;
  name: string;
  weight: InterestWeight | 0;
  color?: string | null;
  avatarUrl?: string | null;
};

/** Interests grouped by slug, the shape get_feed takes for visitors who are not signed in. */
export type FeedInterests = {
  categories: string[];
  tags: string[];
  authors: string[];
  mutedCategories: string[];
  mutedTags: string[];
};

export type FeedReason = { type: InterestType; label: string };

export type FeedItem = { post: PostSummary; reason: FeedReason | null };

export type FeedPage = { items: FeedItem[]; nextPage: number | null };
