import type { PostLevel } from "./types";

/** Cache tags. Server Actions that change content call updateTag() on these. */
export const POST_CACHE_TAGS = {
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
  categories: "categories",
} as const;

/** unstable_cache key prefixes. */
export const POST_CACHE_KEYS = {
  latest: "posts:latest",
  list: "posts:list",
  slugs: "posts:slugs",
  detail: "posts:detail",
  categoryTree: "categories:tree",
} as const;

/** Public pages are regenerated at most this often without a publish. */
export const POST_REVALIDATE_SECONDS = 60 * 60;

export const POST_LIMITS = {
  home: 6,
  list: 30,
  /** Slugs pre-rendered at build; the rest render on first request. */
  staticParams: 200,
  tagsOnCard: 3,
} as const;

export const PUBLISHED_STATUS = "published" as const;

export const POST_LEVELS: Record<PostLevel, { label: string; className: string }> = {
  beginner: { label: "Cơ bản", className: "text-emerald bg-emerald/10 ring-emerald/25" },
  intermediate: { label: "Trung cấp", className: "text-sky bg-sky/10 ring-sky/25" },
  advanced: { label: "Nâng cao", className: "text-violet bg-violet/10 ring-violet/25" },
};
