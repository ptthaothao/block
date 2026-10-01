import type { CommentSort, ReportReason } from "./types";

/** Direct replies shown under a comment before "Xem thêm n bình luận". Applies at every depth. */
export const INITIAL_VISIBLE_REPLIES = 1;
/** How many more direct replies one click on "Xem thêm" reveals. */
export const REPLIES_BATCH_SIZE = 10;

export const COMMENT_LIMITS = {
  /** Top-level threads per page. */
  pageSize: 20,
  /** Replies that travel with a page of threads; the rest of a thread is fetched on demand. */
  repliesPreview: 3,
  bodyMax: 5000,
  /** Show the character counter from this length on. */
  counterFrom: 4500,
  reportNoteMax: 500,
} as const;

/** Writers can edit for this long after posting (matches the database trigger). */
export const COMMENT_EDIT_WINDOW_MS = 15 * 60_000;

export const COMMENT_TIMINGS = {
  /** Drafts are saved after typing pauses this long. */
  draftDebounceMs: 500,
  /** A linked comment (#comment-<id>) stays highlighted this long. */
  highlightMs: 3_000,
  staleMs: 30_000,
} as const;

/** Start loading comments when they are this close to the viewport. */
export const COMMENTS_LAZY_ROOT_MARGIN = "600px";

export const COMMENT_SORTS = [
  { id: "new", label: "Mới nhất" },
  { id: "best", label: "Hay nhất" },
] as const satisfies readonly { id: CommentSort; label: string }[];

export const DEFAULT_COMMENT_SORT: CommentSort = "new";

export const COMMENT_QUERY_KEYS = {
  post: (slug: string, sort: CommentSort) => ["comments", "post", slug, sort] as const,
  postAll: (slug: string) => ["comments", "post", slug] as const,
  replies: (id: string) => ["comments", "replies", id] as const,
  moderation: ["cms", "moderation"] as const,
};

/** localStorage: unsent drafts, one per post. */
export const COMMENT_DRAFT_STORAGE_PREFIX = "codelog:comment-draft:";

/** Type of the pending action replayed after signing in. */
export const COMMENT_PENDING_ACTION = "comment";

/** Anchor prefix for a single comment (#comment-<id>). */
export const COMMENT_ANCHOR_PREFIX = "comment-";

export const REPORT_REASONS = [
  { id: "spam", label: "Spam hoặc quảng cáo" },
  { id: "offensive", label: "Xúc phạm, quấy rối" },
  { id: "off_topic", label: "Lạc đề" },
  { id: "other", label: "Lý do khác" },
] as const satisfies readonly { id: ReportReason; label: string }[];

export const REPORT_REASON_IDS = REPORT_REASONS.map((r) => r.id) as [ReportReason, ...ReportReason[]];

export const COMMENT_STATUS_TONES = {
  pending: "bg-warning/10 text-warning ring-warning/30",
  hidden: "bg-surface-hover text-faint ring-border",
  author: "bg-accent/15 text-accent ring-accent/30",
  reported: "bg-danger/10 text-danger ring-danger/30",
} as const;

export const COMMENT_COPY = {
  title: (n: number) => `Bình luận (${n})`,
  sortLabel: "Sắp xếp bình luận",
  placeholder: "Viết bình luận…",
  replyPlaceholder: (name: string) => `Trả lời ${name}…`,
  send: "Gửi",
  replyHint: "Nhấn Esc để huỷ",
  save: "Lưu",
  cancel: "Huỷ",
  counter: (n: number, max: number) => `${n}/${max}`,
  empty: "Chưa ai bình luận. Hỏi câu đầu tiên đi, tác giả đang chờ đấy.",
  loadFailed: "Không tải được bình luận.",
  retry: "Thử lại",
  loadMore: "Xem thêm bình luận",
  sending: "Đang gửi…",
  sendFailed: "Chưa gửi được",
  pendingLabel: "Đang chờ duyệt",
  pendingNote: "Chỉ bạn thấy bình luận này cho tới khi được duyệt (bình luận có link từ tài khoản mới).",
  hiddenLabel: "Đã ẩn",
  pinned: "Đã ghim",
  authorBadge: "Tác giả",
  edited: "đã sửa",
  deleted: "Bình luận đã bị xoá",
  reply: "Trả lời",
  moreReplies: (n: number) => `Xem thêm ${n} bình luận`,
  repliesFailed: "Không tải được các trả lời.",
  menuLabel: (name: string) => `Tuỳ chọn cho bình luận của ${name}`,
  edit: "Sửa",
  delete: "Xoá",
  deleteConfirm: "Xoá bình luận này? Không hoàn tác được.",
  pin: "Ghim lên đầu",
  unpin: "Bỏ ghim",
  hide: "Ẩn bình luận",
  unhide: "Hiện lại",
  report: "Báo cáo",
  reportTitle: "Báo cáo bình luận",
  reportNote: "Ghi chú thêm (không bắt buộc)",
  reportSend: "Gửi báo cáo",
  reported: "Đã gửi báo cáo. Cảm ơn bạn!",
  loginReason: "Đăng nhập để gửi bình luận. Nội dung bạn gõ vẫn được giữ nguyên.",
  resumed: "Đã gửi bình luận bạn viết trước khi đăng nhập.",
  deletedToast: "Đã xoá bình luận.",
  actionFailed: "Chưa làm được, thử lại nhé.",
  tooLong: (max: number) => `Bình luận dài quá ${max} ký tự.`,
  bodyRequired: "Bình luận chưa có nội dung.",
  close: "Đóng",
} as const;

export const MODERATION_COPY = {
  title: "Kiểm duyệt",
  description: "Bình luận chờ duyệt và bình luận bị báo cáo.",
  empty: "Không có gì cần duyệt. Cộng đồng đang ngoan.",
  approve: "Duyệt",
  hide: "Ẩn",
  dismiss: "Bỏ qua",
  pending: "Chờ duyệt",
  reports: (n: number) => `${n} báo cáo`,
  openPost: "Mở bài",
  done: "Đã xử lý.",
} as const;

/** Anchor of the comments section on the post page (the reaction widgets link to it too). */
export const POST_COMMENTS_ANCHOR = "comments";
