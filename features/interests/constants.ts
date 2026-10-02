import type { FeedInterests, InterestType } from "./types";

export const INTEREST_TYPES = ["category", "tag", "author"] as const satisfies readonly InterestType[];

/** TanStack Query keys. */
export const INTEREST_QUERY_KEYS = {
  /** Prefix of every reader's list: invalidate this after bulk writes (import, reset). */
  mine: ["interests", "mine"] as const,
  /** One reader's list, so a different account never sees another's cached follows. */
  mineOf: (username: string) => ["interests", "mine", username] as const,
  feed: (signature: string) => ["interests", "feed", signature] as const,
};

export const INTEREST_LIMITS = {
  /** Items a visitor can keep in localStorage (and send to /api/feed). */
  guestItems: 60,
  /** Onboarding asks for at least this many picks. */
  onboardingMin: 3,
  /** Posts per feed page on the home page. */
  feedPage: 6,
  /** Popular tags offered in onboarding. */
  onboardingTags: 16,
} as const;

export const INTEREST_TIMINGS = {
  /** How long the "Hoàn tác" toast stays up. */
  undoMs: 6_000,
  /** The feed is personal but not live; reuse it for this long. */
  feedStaleMs: 60_000,
} as const;

/** localStorage for visitors who are not signed in. Bump the version when the stored shape changes. */
export const GUEST_INTERESTS_STORAGE = { key: "codelog:interests", version: 1 } as const;

/** sessionStorage: the reader already answered "save these to your account?". */
export const IMPORT_PROMPT_DISMISSED_KEY = "codelog:interests-import-dismissed";

/** sessionStorage: the home feed tab the reader picked. */
export const FEED_TAB_STORAGE_KEY = "codelog:feed-tab";

/** Query-string keys for /api/feed when the visitor is not signed in. */
export const FEED_QUERY_PARAMS = {
  page: "page",
  categories: "c",
  tags: "t",
  authors: "a",
  mutedCategories: "mc",
  mutedTags: "mt",
} as const;

export const FEED_TABS = [
  { id: "for-you", label: "Dành cho bạn" },
  { id: "latest", label: "Mới nhất" },
] as const;
export type FeedTab = (typeof FEED_TABS)[number]["id"];

export const INTEREST_COPY = {
  follow: "Quan tâm",
  following: "Đang quan tâm",
  followAuthor: "Theo dõi",
  followingAuthor: "Đang theo dõi",
  followLabel: (name: string) => `Quan tâm ${name}`,
  unfollowLabel: (name: string) => `Bỏ quan tâm ${name}`,
  followers: (n: number) => `${n} người quan tâm`,
  reason: (label: string) => `Vì bạn quan tâm ${label}`,
  menuLabel: (title: string) => `Tuỳ chọn cho bài "${title}"`,
  lessLikeThis: "Ít nội dung như thế này hơn",
  mutedToast: (name: string) => `Đã hiểu, sẽ ít bài về ${name} hơn.`,
  mutedCard: "Đã ẩn bớt nội dung như thế này.",
  undo: "Hoàn tác",
  followedToast: (name: string) => `Đã quan tâm ${name}.`,
  unfollowedToast: (name: string) => `Đã bỏ quan tâm ${name}.`,
  unmutedToast: (name: string) => `Đã bỏ ẩn ${name}.`,
  saveFailed: "Chưa lưu được, thử lại nhé.",
  feedEmpty: "Chưa có bài nào hợp gu. Thử quan tâm thêm vài chủ đề nhé.",
  feedError: "Không tải được gợi ý.",
  retry: "Thử lại",
  loadMore: "Xem thêm",
  feedTabsLabel: "Bài viết trên trang chủ",
  refreshFeed: "Cập nhật gợi ý",
  inviteTitle: "Chọn chủ đề bạn quan tâm",
  inviteBody: "Chọn vài chủ đề, trang chủ sẽ ưu tiên bài hợp gu bạn. Không cần đăng nhập.",
  inviteAction: "Chọn ngay",
  onboardingTitle: "Bạn quan tâm gì?",
  onboardingSubtitle: "Chọn ít nhất 3 mục để trang chủ hợp gu bạn hơn. Đổi lại bất cứ lúc nào.",
  onboardingTopics: "Chủ đề",
  onboardingTags: "Công nghệ",
  onboardingPicked: (n: number) => `Đã chọn ${n}`,
  onboardingNeedMore: (n: number) => `Chọn thêm ${n} nữa`,
  onboardingSkip: "Bỏ qua",
  onboardingDone: "Xong, vào đọc thôi",
  importTitle: "Lưu các mục quan tâm vào tài khoản?",
  importBody: (n: number) => `Bạn đã chọn ${n} mục khi chưa đăng nhập.`,
  importSave: "Lưu",
  importDismiss: "Không, cảm ơn",
  importDone: "Đã lưu vào tài khoản.",
  manageTitle: "Quan tâm của tôi",
  manageDescription: "Những gì bạn chọn ở đây quyết định tab \"Dành cho bạn\" trên trang chủ.",
  groupTopics: "Chủ đề",
  groupTags: "Tag",
  groupAuthors: "Tác giả đang theo dõi",
  groupMuted: "Đã ẩn",
  remove: "Bỏ",
  unmute: "Bỏ ẩn",
  addMore: "+ Thêm chủ đề",
  reset: "Đặt lại gợi ý",
  resetConfirm: "Xoá hết mục quan tâm và mục đã ẩn? Trang chủ sẽ quay về \"Mới nhất\".",
  resetDone: "Đã đặt lại gợi ý.",
  groupEmpty: "Chưa có mục nào.",
  mutedEmpty: "Bạn chưa ẩn gì.",
} as const;

export const EMPTY_FEED_INTERESTS: FeedInterests = {
  categories: [],
  tags: [],
  authors: [],
  mutedCategories: [],
  mutedTags: [],
};

export const INTEREST_CACHE_TAGS = { followers: "followers" } as const;

export const FOLLOWER_CACHE = { key: "interests:followers", revalidateSeconds: 10 * 60 } as const;
