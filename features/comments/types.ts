import type { ReactionCounts, ReactionKind } from "@/features/reactions/types";
import type { Enums } from "@/types/database";

export type CommentStatus = Enums<"comment_status">;
export type ReportReason = Enums<"report_reason">;
export type CommentSort = "best" | "new";

export type CommentAuthor = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isPostAuthor: boolean;
};

/** A comment as the browser sees it. Permissions are decided on the server. */
export type CommentDTO = {
  id: string;
  parentId: string | null;
  bodyHtml: string;
  /** The Markdown, only for the writer while they may still edit it. */
  bodyMd: string | null;
  createdAt: string;
  editedAt: string | null;
  /** Only "visible" reaches other readers; the writer and moderators also see "pending"/"hidden". */
  status: CommentStatus;
  isPinned: boolean;
  isDeleted: boolean;
  isMine: boolean;
  /** Null once the comment is deleted. */
  author: CommentAuthor | null;
  reactions: ReactionCounts;
  myReactions: ReactionKind[];
  replyCount: number;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canHide: boolean;
  canReport: boolean;
};

/** A top-level comment with the first few replies. */
export type CommentThread = CommentDTO & { replies: CommentDTO[] };

export type CommentPage = {
  threads: CommentThread[];
  /** Top-level threads, for paging. */
  total: number;
  /** Every visible comment on the post, for the heading. */
  commentCount: number;
  nextPage: number | null;
};

export type CommentReplies = { replies: CommentDTO[] };

export type NewComment = { postSlug: string; parentId: string | null; body: string };

export type CommentEdit = { id: string; body: string };

export type CommentReport = { id: string; reason: ReportReason; note?: string };

/** An item in the moderation queue (/dashboard/moderation). */
export type ModerationItem = {
  commentId: string;
  status: CommentStatus;
  body: string;
  createdAt: string;
  openReports: number;
  reasons: ReportReason[];
  author: { username: string; displayName: string } | null;
  post: { slug: string; title: string } | null;
};
