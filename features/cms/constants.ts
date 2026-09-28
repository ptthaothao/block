import type { CategoryInput, SeriesInput } from "./schemas";
import type { PostFormValues, PostLevel, PostStatus, SaveState, TagStatus } from "./types";

export const CMS_LIMITS = {
  postList: 100,
  tagsPerPost: 5,
  titleMax: 160,
  excerptMax: 300,
  contentMax: 200_000,
  seoTitleMax: 70,
  seoDescriptionMax: 160,
  categoryNameMax: 60,
  descriptionMax: 500,
  iconMax: 40,
  positionMax: 999,
  tagNameMax: 40,
  seriesTitleMax: 120,
  reviewNoteMax: 1000,
} as const;

export const CMS_TIMINGS = {
  /** Unsaved changes on an existing draft are saved after this pause. */
  autosaveDelayMs: 5_000,
  /** Preview re-renders after the author stops typing this long. */
  previewDebounceMs: 600,
  /** Default staleTime (ms) for CMS queries, from the QueryClient default. */
  defaultStaleTimeMs: 30_000,
  /** Categories/tags/series change rarely; cache them longer than posts. */
  taxonomyStaleTimeMs: 5 * 60_000,
} as const;

/** TanStack Query keys. */
export const CMS_QUERY_KEYS = {
  posts: (status: PostStatus | null) => ["cms", "posts", status ?? "all"] as const,
  allPosts: ["cms", "posts"] as const,
  post: (id: string) => ["cms", "post", id] as const,
  review: ["cms", "review"] as const,
  taxonomy: ["cms", "taxonomy"] as const,
};

export const POST_STATUSES = ["draft", "review", "published", "archived"] as const satisfies readonly PostStatus[];

/** Statuses an author may still edit; after that only editors can. */
export const AUTHOR_EDITABLE_STATUSES: readonly PostStatus[] = ["draft", "review"];

export const POST_STATUS_META: Record<PostStatus, { label: string; className: string }> = {
  draft: { label: "Nháp", className: "text-muted bg-surface-hover ring-border-strong" },
  review: { label: "Chờ duyệt", className: "text-warning bg-warning/10 ring-warning/25" },
  published: { label: "Đã đăng", className: "text-emerald bg-emerald/10 ring-emerald/25" },
  archived: { label: "Lưu trữ", className: "text-faint bg-surface-sunken ring-border" },
};

export const POST_LEVEL_OPTIONS: { value: PostLevel; label: string }[] = [
  { value: "beginner", label: "Cơ bản" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
];

export const TAG_STATUS_META: Record<TagStatus, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "text-warning bg-warning/10 ring-warning/25" },
  approved: { label: "Đã duyệt", className: "text-emerald bg-emerald/10 ring-emerald/25" },
};

/** Postgres error codes we translate for people. */
export const PG_ERROR_CODES = {
  uniqueViolation: "23505",
  foreignKeyViolation: "23503",
  insufficientPrivilege: "42501",
  checkViolation: "23514",
} as const;

export const CMS_ERROR_MESSAGES = {
  forbidden: "Bạn không có quyền làm việc này.",
  notFound: "Không tìm thấy hoặc bạn không có quyền sửa.",
  duplicateSlug: "Slug này đã được dùng, hãy đổi slug khác.",
  inUse: "Mục này đang được dùng nên chưa xoá được.",
  invalid: "Dữ liệu chưa hợp lệ.",
  unknown: "Có lỗi xảy ra, thử lại sau nhé.",
} as const;

export const TAXONOMY_TABS = [
  { id: "categories", label: "Danh mục" },
  { id: "tags", label: "Tag" },
  { id: "series", label: "Series" },
] as const;
export type TaxonomyTab = (typeof TAXONOMY_TABS)[number]["id"];

/** Separator authors type between tags. */
export const TAG_INPUT_SEPARATOR = ",";

export const HTTP_STATUS = { badRequest: 400, forbidden: 403, notFound: 404 } as const;

export const EMPTY_POST_FORM: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  contentMd: "",
  categoryId: null,
  level: "beginner",
  seriesId: null,
  seriesPosition: null,
  coverUrl: "",
  seoTitle: "",
  seoDescription: "",
  tagsText: "",
};

export const SAVE_STATE_LABELS: Record<SaveState, string> = {
  idle: "",
  dirty: "Chưa lưu",
  saving: "Đang lưu…",
  saved: "Đã lưu",
  error: "Lưu lỗi",
};

/** Joins tags back into the editor's tag field. */
export const TAG_INPUT_JOINER = ", ";

export const EMPTY_CATEGORY_FORM: CategoryInput = {
  id: null,
  parentId: null,
  name: "",
  slug: "",
  description: "",
  icon: "",
  color: "",
  position: 0,
};

export const EMPTY_SERIES_FORM: SeriesInput = {
  id: null,
  title: "",
  slug: "",
  description: "",
  coverUrl: "",
};

export const CONFIRM_MESSAGES = {
  deleteCategory: "Xoá danh mục này? Danh mục còn bài viết hoặc danh mục con sẽ không xoá được.",
  deleteTag: "Xoá tag này khỏi mọi bài viết?",
  deleteSeries: "Xoá series này? Các bài trong series vẫn được giữ lại.",
  mergeTag: "Gộp tag này vào tag đã chọn? Tag hiện tại sẽ bị xoá.",
} as const;
