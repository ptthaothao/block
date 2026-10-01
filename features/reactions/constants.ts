import { POST_COMMENTS_ANCHOR } from "@/features/comments/constants";

import type { ReactionKind } from "./types";

/** The fixed emoji set, in display order. Must match the reaction_kind enum in the database. */
export const REACTIONS = [
  { kind: "helpful", emoji: "👍", label: "Hữu ích", tone: "text-accent" },
  { kind: "love", emoji: "❤️", label: "Yêu thích", tone: "text-danger" },
  { kind: "mindblown", emoji: "🤯", label: "Mở mang", tone: "text-warning" },
  { kind: "confused", emoji: "🤔", label: "Chưa hiểu", tone: "text-violet" },
] as const satisfies readonly { kind: ReactionKind; emoji: string; label: string; tone: string }[];

export const REACTION_KINDS = REACTIONS.map((r) => r.kind) as [ReactionKind, ...ReactionKind[]];

/** A quick tap on the mobile bar leaves this one; a long press opens the picker. */
export const QUICK_REACTION: ReactionKind = "helpful";

export const REACTION_QUERY_KEYS = {
  post: (slug: string) => ["reactions", "post", slug] as const,
  people: (targetKey: string, emoji: ReactionKind) => ["reactions", "people", targetKey, emoji] as const,
};

export const REACTION_LIMITS = {
  /** Names shown in the tooltip before "và N người khác". */
  peopleNames: 2,
} as const;

export const REACTION_TIMINGS = {
  /** The "pop" when a reaction is picked (scale 1 → 1.25 → 1). Also set in globals.css. */
  bounceMs: 150,
  /** Hold this long on the mobile bar (or a comment's Like) to open the picker. */
  longPressMs: 450,
  /** Hover a comment's Like this long to open the picker. */
  pickerOpenMs: 500,
  /** Leaving the Like button and the picker closes it after this long, so the pointer can cross the gap. */
  pickerCloseMs: 300,
  /** Hover the reaction cluster this long to show the per-emoji counts. */
  breakdownDelayMs: 300,
  /** Tooltip names barely change; reuse them for a while. */
  peopleStaleMs: 5 * 60_000,
  /** Counts are refetched when the tab regains focus, and otherwise reused this long. */
  countsStaleMs: 30_000,
} as const;

/** The mobile bar stays hidden until the reader is this far down the page. */
export const MOBILE_BAR_TOP_OFFSET_PX = 400;

/** Anchors on the post page. */
export const POST_ANCHORS = { reactions: "reactions", comments: POST_COMMENTS_ANCHOR } as const;

/** Type of the pending action replayed after signing in. */
export const REACTION_PENDING_ACTION = "reaction";

/** How many emoji the stacked cluster under a comment shows. */
export const CLUSTER_ICON_LIMIT = 3;

export const REACTION_COPY = {
  like: "Thích",
  likeLabel: "Thích. Giữ hoặc nhấn mũi tên lên để chọn cảm xúc khác",
  unlikeLabel: (label: string) => `${label}, bấm để bỏ`,
  clusterLabel: (total: number) => `${total} reaction, xem chi tiết`,
  groupLabel: "Reaction cho bài viết",
  endTitle: "Bài này thế nào với bạn?",
  endHint: "Một cú bấm giúp tác giả biết nên viết tiếp gì.",
  buttonLabel: (label: string, count: number, mine: boolean) =>
    `${label}, ${count} người${mine ? ", bạn đã chọn" : ""}`,
  summaryLabel: (total: number) => `${total} reaction`,
  comments: (n: number) => `${n} bình luận`,
  goToComments: "Tới phần bình luận",
  pickerLabel: "Chọn reaction",
  moreReactions: "Thêm reaction",
  loginReason: "Đăng nhập để thả reaction. Xong sẽ quay lại đúng bài này.",
  resumed: (emoji: string) => `Đã thả ${emoji} giúp bạn.`,
  failed: "Chưa thả được reaction, thử lại nhé.",
  rateLimited: "Bấm hơi nhanh rồi, chờ chút nhé.",
  loadFailed: "Không tải được reaction.",
  retry: "Thử lại",
  peopleLoading: "Đang tải…",
  people: (names: string[], others: number) =>
    others > 0 ? `${names.join(", ")} và ${others} người khác` : names.join(" và "),
} as const;
