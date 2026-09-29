import type { PostFilters, PostLevel } from "./types";

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
  filtered: "posts:filtered",
} as const;

/** Public pages are regenerated at most this often without a publish. */
export const POST_REVALIDATE_SECONDS = 60 * 60;

export const POST_LIMITS = {
  home: 6,
  list: 30,
  /** Slugs pre-rendered at build; the rest render on first request. */
  staticParams: 200,
  tagsOnCard: 3,
  /** Tag filters accepted from one URL; more are ignored. */
  filterTags: 10,
} as const;

export const PUBLISHED_STATUS = "published" as const;

export const POST_LEVELS: Record<PostLevel, { label: string; className: string }> = {
  beginner: { label: "Cơ bản", className: "text-emerald bg-emerald/10 ring-emerald/25" },
  intermediate: { label: "Trung cấp", className: "text-sky bg-sky/10 ring-sky/25" },
  advanced: { label: "Nâng cao", className: "text-violet bg-violet/10 ring-violet/25" },
};

export const POST_LEVEL_VALUES = ["beginner", "intermediate", "advanced"] as const satisfies readonly PostLevel[];

export const EMPTY_POST_FILTERS: PostFilters = { topic: null, tags: [], levels: [], author: null, page: 0 };

/** Shape of slugs and usernames accepted from the URL. */
export const URL_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;

export const FILTER_COPY = {
  panelLabel: "Bộ lọc bài viết",
  topics: "Danh mục",
  tags: "Tag",
  authors: "Tác giả",
  levels: "Độ khó",
  selected: "(đang chọn)",
  showAll: (n: number) => `Xem tất cả (${n})`,
  showLess: "Thu gọn",
  searchTags: "Tìm tag…",
  noTagMatch: "Không có tag nào khớp.",
  openFilters: (n: number) => (n > 0 ? `Lọc (${n})` : "Lọc"),
  sheetTitle: "Lọc bài viết",
  showResults: (n: number) => `Xem ${n} bài`,
  clear: "Xoá bộ lọc",
  removeFilter: (label: string) => `Bỏ lọc ${label}`,
  resultCount: (n: number) => `${n} bài`,
  emptyTitle: "Không có bài nào khớp bộ lọc",
  emptyHint: "Thử bỏ bớt vài điều kiện xem sao.",
} as const;

/** Placeholder cards shown while a list loads. */
export const POST_SKELETON_COUNT = 6;

/** Between a parent and child category, e.g. "Frontend › React". */
export const CATEGORY_TRAIL_SEPARATOR = " › ";

/** Placeholder rows in the filter sidebar while /posts loads. */
export const FILTER_SKELETON_ROWS = 8;
