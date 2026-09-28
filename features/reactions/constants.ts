import type { ReactionKind } from "./types";

/** The fixed emoji set, in display order. Must match the reaction_kind enum in the database. */
export const REACTIONS = [
  { kind: "helpful", emoji: "👍", label: "Hữu ích" },
  { kind: "love", emoji: "❤️", label: "Thích" },
  { kind: "mindblown", emoji: "🤯", label: "Mở mang" },
  { kind: "confused", emoji: "🤔", label: "Chưa hiểu" },
] as const satisfies readonly { kind: ReactionKind; emoji: string; label: string }[];

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
  /** Hold this long on the mobile bar to open the picker. */
  longPressMs: 450,
  /** Tooltip names barely change; reuse them for a while. */
  peopleStaleMs: 5 * 60_000,
  /** Counts are refetched when the tab regains focus, and otherwise reused this long. */
  countsStaleMs: 30_000,
} as const;

/** The mobile bar stays hidden until the reader is this far down the page. */
export const MOBILE_BAR_TOP_OFFSET_PX = 400;

/** Anchors on the post page. */
export const POST_ANCHORS = { reactions: "reactions", comments: "comments" } as const;

/** Type of the pending action replayed after signing in. */
export const REACTION_PENDING_ACTION = "reaction";

export const REACTION_COPY = {
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
