export const COMMENT_SELECT =
  "id, post_id, parent_id, root_id, author_id, body_md, status, is_pinned, reaction_counts, reply_count, edited_at, deleted_at, created_at, author:profiles!comments_author_id_fkey(username, display_name, avatar_url)" as const;

export const MODERATION_SELECT = "comment_id, post_id, status, body_md, created_at, author_id, open_reports, reasons" as const;
