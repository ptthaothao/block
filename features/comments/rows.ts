import type { Json } from "@/types/database";

import type { CommentStatus, ReportReason } from "./types";

type Embedded<T> = T | T[] | null;

export type CommentAuthorRow = { username: string; display_name: string; avatar_url: string | null };

export type CommentRow = {
  id: string;
  post_id: string;
  parent_id: string | null;
  root_id: string | null;
  author_id: string;
  body_md: string;
  status: CommentStatus;
  is_pinned: boolean;
  reaction_counts: Json;
  reply_count: number;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
  author: Embedded<CommentAuthorRow>;
};

export type ModerationRow = {
  comment_id: string;
  post_id: string;
  status: CommentStatus;
  body_md: string;
  created_at: string;
  author_id: string;
  open_reports: number;
  reasons: ReportReason[] | null;
};
