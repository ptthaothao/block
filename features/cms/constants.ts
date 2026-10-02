import { ROUTES } from "@/config/routes";
import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";

import type { CategoryInput, SeriesInput } from "./schemas";
import type {
  MarkdownFormat,
  PostFormValues,
  PostLevel,
  PostStatus,
  SaveState,
  TagSort,
  TagStatus,
  TagStatusFilter,
} from "./types";

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
  /** Tags per page in the taxonomy tag table. */
  tagPageSize: 10,
  /** Most rows one bulk action (approve, delete, merge, reorder) may touch. */
  bulkMax: 200,
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

export const TAG_STATUS_META: Record<TagStatus, { label: string; className: string; dotClassName: string }> = {
  pending: { label: "Chờ duyệt", className: "text-warning bg-warning/10 ring-warning/25", dotClassName: "bg-warning" },
  approved: { label: "Đã duyệt", className: "text-emerald bg-emerald/10 ring-emerald/25", dotClassName: "bg-emerald" },
};

export const CMS_ERROR_MESSAGES = {
  forbidden: COMMON_ERROR_MESSAGES.forbidden,
  notFound: "Không tìm thấy hoặc bạn không có quyền sửa.",
  duplicateSlug: "Slug này đã được dùng, hãy đổi slug khác.",
  inUse: "Mục này đang được dùng nên chưa xoá được.",
  invalid: COMMON_ERROR_MESSAGES.invalid,
  unknown: COMMON_ERROR_MESSAGES.unknown,
} as const;

export const TAXONOMY_TABS = [
  { id: "categories", label: "Danh mục" },
  { id: "tags", label: "Tag" },
  { id: "series", label: "Series" },
] as const;
export type TaxonomyTab = (typeof TAXONOMY_TABS)[number]["id"];

/** Separator authors type between tags. */
export const TAG_INPUT_SEPARATOR = ",";

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
  deleteTags: (count: number) => `Xoá ${count} tag đã chọn khỏi mọi bài viết?`,
} as const;

/** Copy for /cms/taxonomy. */
export const TAXONOMY_COPY = {
  title: "Phân loại",
  description: "Danh mục 2 cấp, tag và series dùng cho bài viết.",
  tabsLabel: "Loại phân loại",
  cacheSynced: "Đồng bộ bộ nhớ đệm",
  autoSlug: "Tự tạo từ tên",
  save: "Lưu thay đổi",
  cancel: "Huỷ",
  delete: "Xoá",
  close: "Đóng",
  categories: {
    search: "Tìm danh mục…",
    add: "Thêm danh mục",
    addChild: (name: string) => `Thêm danh mục con cho ${name}`,
    collapseAll: "Thu gọn tất cả",
    expandAll: "Mở rộng tất cả",
    childCount: (n: number) => `${n} mục con`,
    hint: "Kéo để sắp xếp thứ tự (hoặc dùng phím ↑ ↓ trên tay nắm). Chỉ danh mục cấp 1 mới có mục con.",
    empty: "Chưa có danh mục nào",
    noMatch: "Không có danh mục khớp",
    editTitle: "Sửa danh mục",
    newTitle: "Thêm danh mục",
    preview: "Xem trước giao diện public:",
    pickHint: "Chọn một danh mục bên trái để sửa, hoặc bấm “Thêm danh mục”.",
    noParent: "Không (cấp 1)",
    reorder: (name: string) => `Kéo để đổi thứ tự ${name}`,
    expand: (name: string) => `Mở/thu ${name}`,
    positionDown: "Giảm thứ tự",
    positionUp: "Tăng thứ tự",
    defaultIcon: "mặc định",
    hasChildren: "Danh mục đang có mục con nên phải ở cấp 1.",
  },
  tags: {
    search: "Tìm tag…",
    newPlaceholder: "Tên tag mới…",
    add: "Thêm",
    sort: "Sắp xếp",
    approve: "Duyệt",
    rename: "Đổi tên",
    merge: "Gộp vào tag khác…",
    remove: "Xoá tag",
    actions: (name: string) => `Tuỳ chọn cho #${name}`,
    select: (name: string) => `Chọn #${name}`,
    selectPage: "Chọn tất cả tag trên trang",
    selected: (n: number) => `Đã chọn ${n} tag`,
    approveAll: "Duyệt tất cả",
    mergeInto: "Gộp vào…",
    clearSelection: "Bỏ chọn",
    showing: (from: number, to: number, total: number) => `Hiển thị ${from}-${to} trong ${total} tag`,
    prev: "Trước",
    next: "Sau",
    pagination: "Phân trang tag",
    empty: "Không có tag nào khớp",
    renameTitle: "Đổi tên tag",
    mergeTitle: "Gộp tag",
    mergeTarget: "Gộp vào tag",
    mergeSources: (names: string) => `Gộp ${names} vào:`,
    pickTarget: "Chọn tag đích",
    mergeConfirm: "Gộp",
    nameLabel: "Tên",
    slugLabel: "Slug",
  },
  series: {
    search: "Tìm series theo tên, slug hoặc tóm tắt…",
    add: "Thêm series",
    editTitle: "Sửa series",
    newTitle: "Thêm series",
    editing: "Đang chỉnh sửa",
    postCount: (n: number) => `${n} bài viết`,
    title: "Tên series",
    slug: "Đường dẫn tĩnh (Slug)",
    description: "Mô tả tóm tắt",
    cover: "Ảnh bìa series (16:9)",
    remove: "Xoá series",
    edit: (title: string) => `Sửa series ${title}`,
    removeOne: (title: string) => `Xoá series ${title}`,
    empty: "Chưa có series nào",
    noMatch: "Không có series khớp",
  },
} as const;

/** Column headers of the taxonomy tables. */
export const TAXONOMY_COLUMNS = {
  categories: { name: "Tên", slug: "Slug", posts: "Số bài", actions: "Thao tác" },
  tags: { tag: "Tag", status: "Trạng thái", posts: "Số bài viết", actions: "Thao tác" },
} as const;

/** Category form field labels. */
export const CATEGORY_FIELD_LABELS = {
  name: "Tên",
  slug: "Slug",
  parent: "Danh mục cha",
  description: "Mô tả",
  color: "Màu sắc đại diện",
  icon: "Biểu tượng",
  position: "Thứ tự",
} as const;

/** Swatches offered for a category's colour; any #RRGGBB can still be typed. */
export const CATEGORY_COLOR_SWATCHES = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#34d399",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#22c55e",
  "#64748b",
] as const;

/** Shown before the slug input: where the item lives on the public site. */
export const TAXONOMY_SLUG_PREFIXES = {
  category: `${ROUTES.topics}/`,
  series: "/series/",
} as const;

export const TAG_STATUS_FILTERS: { id: TagStatusFilter; label: string; dotClassName?: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: TAG_STATUS_META.pending.label, dotClassName: TAG_STATUS_META.pending.dotClassName },
  { id: "approved", label: TAG_STATUS_META.approved.label, dotClassName: TAG_STATUS_META.approved.dotClassName },
];

export const TAG_SORT_OPTIONS: { id: TagSort; label: string }[] = [
  { id: "posts", label: "Số bài" },
  { id: "name", label: "Tên" },
];

/** Where series cover images are uploaded in Supabase Storage. */
export const SERIES_COVER_STORAGE = { bucket: "post", path: "series" } as const;

/** Copy for the CMS shell (sidebar, topbar, mobile drawer). */
export const CMS_SHELL_COPY = {
  brand: "CMS",
  navLabel: "Quản trị",
  openMenu: "Mở menu quản trị",
  menuTitle: "Menu quản trị",
  viewSite: "Xem trang",
  collapseSidebar: "Thu gọn menu",
  expandSidebar: "Mở rộng menu",
} as const;

/** localStorage: the desktop sidebar is collapsed to an icon rail. */
export const CMS_SIDEBAR_COLLAPSED_KEY = "codelog:cms-sidebar-collapsed";

/** Icons exported from the editor's Figma design (public/icons/cms-editor). */
/** Icons exported from the editor's Figma design (public/icons/cms-editor), at their native size in px. */
export const EDITOR_ICONS = {
  adjustments: { src: "/icons/cms-editor/adjustments.svg", size: 16 },
  barsBottomRight: { src: "/icons/cms-editor/bars-bottom-right.svg", size: 14 },
  chevronDown: { src: "/icons/cms-editor/chevron-down.svg", size: 14 },
  chevronDownSmall: { src: "/icons/cms-editor/chevron-down-small.svg", size: 12 },
  cloudUpload: { src: "/icons/cms-editor/cloud-upload.svg", size: 14 },
  code: { src: "/icons/cms-editor/code.svg", size: 14 },
  copySmall: { src: "/icons/cms-editor/copy-small.svg", size: 12 },
  image: { src: "/icons/cms-editor/image.svg", size: 14 },
  info: { src: "/icons/cms-editor/info.svg", size: 12 },
  link: { src: "/icons/cms-editor/link.svg", size: 14 },
  list: { src: "/icons/cms-editor/list.svg", size: 14 },
  pencil: { src: "/icons/cms-editor/pencil.svg", size: 12 },
  quote: { src: "/icons/cms-editor/quote.svg", size: 14 },
  search: { src: "/icons/cms-editor/search.svg", size: 14 },
  table: { src: "/icons/cms-editor/table.svg", size: 14 },
  upload: { src: "/icons/cms-editor/upload.svg", size: 20 },
} as const;
export type EditorIconName = keyof typeof EDITOR_ICONS;

export const MARKDOWN_FORMATS = {
  h1: { kind: "line", prefix: "# " },
  h2: { kind: "line", prefix: "## " },
  h3: { kind: "line", prefix: "### " },
  bold: { kind: "wrap", before: "**", after: "**", placeholder: "chữ đậm" },
  italic: { kind: "wrap", before: "_", after: "_", placeholder: "chữ nghiêng" },
  strike: { kind: "wrap", before: "~~", after: "~~", placeholder: "gạch ngang" },
  code: { kind: "wrap", before: "`", after: "`", placeholder: "code" },
  codeBlock: { kind: "wrap", before: "```ts\n", after: "\n```", placeholder: "// code" },
  quote: { kind: "line", prefix: "> " },
  link: { kind: "wrap", before: "[", after: "](https://)", placeholder: "liên kết" },
  image: { kind: "wrap", before: "![", after: "](https://)", placeholder: "mô tả ảnh" },
  list: { kind: "line", prefix: "- " },
  table: { kind: "block", snippet: "| Cột 1 | Cột 2 |\n| --- | --- |\n| | |\n" },
} as const satisfies Record<string, MarkdownFormat>;
export type MarkdownFormatId = keyof typeof MARKDOWN_FORMATS;

type ToolbarButton = { format: MarkdownFormatId; label: string } & (
  | { text: string; textClassName: string }
  | { icon: EditorIconName }
);

/** Markdown toolbar, in groups split by a divider. */
export const MARKDOWN_TOOLBAR: readonly (readonly ToolbarButton[])[] = [
  [
    { format: "h1", label: "Tiêu đề 1", text: "H1", textClassName: "font-mono font-semibold" },
    { format: "h2", label: "Tiêu đề 2", text: "H2", textClassName: "font-mono font-semibold" },
    { format: "h3", label: "Tiêu đề 3", text: "H3", textClassName: "font-mono font-semibold" },
  ],
  [
    { format: "bold", label: "In đậm (Ctrl+B)", text: "B", textClassName: "font-bold" },
    { format: "italic", label: "In nghiêng (Ctrl+I)", text: "I", textClassName: "font-serif italic" },
    { format: "strike", label: "Gạch ngang", text: "S", textClassName: "line-through" },
  ],
  [
    { format: "code", label: "Code trong dòng", icon: "code" },
    { format: "codeBlock", label: "Khối code", icon: "barsBottomRight" },
    { format: "quote", label: "Trích dẫn", icon: "quote" },
    { format: "link", label: "Liên kết (Ctrl+K)", icon: "link" },
    { format: "image", label: "Ảnh", icon: "image" },
  ],
  [
    { format: "list", label: "Danh sách", icon: "list" },
    { format: "table", label: "Bảng", icon: "table" },
  ],
];

/** Ctrl/Cmd + key in the markdown editor. */
export const MARKDOWN_SHORTCUTS: Readonly<Record<string, MarkdownFormatId>> = {
  b: "bold",
  i: "italic",
  k: "link",
};

/** Tag chips cycle through these tones, in order. */
export const TAG_CHIP_TONES = [
  "border-accent/30 bg-accent/15 text-accent-hover",
  "border-sky/30 bg-sky/15 text-sky",
  "border-emerald/30 bg-emerald/15 text-emerald",
  "border-violet/30 bg-violet/15 text-violet",
] as const;

/** Between a parent and child category, e.g. "Frontend › Next.js". */
export const CATEGORY_PATH_SEPARATOR = " › ";

/** Line numbers in the markdown gutter are padded to this many digits. */
export const LINE_NUMBER_DIGITS = 2;

/** What the save line under the editor says before anything has been saved this session. */
export const IDLE_SAVE_HINTS = {
  unsaved: "Bấm Lưu để tạo bản nháp, sau đó bài sẽ tự lưu",
  autosave: "Tự động lưu khi có thay đổi",
  readOnly: "Chế độ chỉ xem",
} as const;

/** Where post cover images are uploaded in Supabase Storage. */
export const COVER_IMAGE_STORAGE = { bucket: "post", path: "cover" } as const;

/** Automatic checks on a post waiting for review (utils/review-checks). */
export const REVIEW_RULES = {
  titleMinChars: 5,
  minWords: 500,
} as const;

/** Leading characters of a post id shown in the review header. */
export const REVIEW_SHORT_ID_LENGTH = 8;

/** Quick notes the reviewer can add to the "return to author" note. */
export const REVIEW_NOTE_TEMPLATES = [
  { label: "Quá ngắn / thiếu nội dung", text: "Bài còn ngắn, bạn bổ sung thêm phần giải thích và ví dụ giúp mình nhé." },
  { label: "Thiếu giải thích code", text: "Các đoạn code cần thêm giải thích ngắn: đoạn code làm gì và vì sao viết như vậy." },
] as const;
