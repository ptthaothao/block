import type { FeedInterests, InterestChange, InterestItem, InterestType, InterestWeight } from "../types";

/** Current weight of a target in a list of interests (0 when absent). */
export function weightOf(items: InterestItem[], type: InterestType, slug: string): InterestWeight | 0 {
  return items.find((item) => item.type === type && item.slug === slug)?.weight ?? 0;
}

/** The list after one change: replaces, adds or (weight 0) removes the target. */
export function applyInterestChange(items: InterestItem[], change: InterestChange): InterestItem[] {
  const rest = items.filter((item) => !(item.type === change.type && item.slug === change.slug));
  if (change.weight === 0) return rest;
  return [
    ...rest,
    {
      type: change.type,
      slug: change.slug,
      name: change.name,
      weight: change.weight,
      color: change.color ?? null,
      avatarUrl: change.avatarUrl ?? null,
    },
  ];
}

/** Group interests by slug for get_feed. */
export function toFeedInterests(items: InterestItem[]): FeedInterests {
  const pick = (type: InterestType, weight: InterestWeight) =>
    items.filter((item) => item.type === type && item.weight === weight).map((item) => item.slug);
  return {
    categories: pick("category", 1),
    tags: pick("tag", 1),
    authors: pick("author", 1),
    mutedCategories: pick("category", -1),
    mutedTags: pick("tag", -1),
  };
}

export function hasFollows(items: InterestItem[]): boolean {
  return items.some((item) => item.weight === 1);
}

/** A short stable string for query keys: changes whenever the interests do. */
export function interestsSignature(items: InterestItem[]): string {
  return items
    .map((item) => `${item.type}:${item.slug}:${item.weight}`)
    .sort()
    .join("|");
}
