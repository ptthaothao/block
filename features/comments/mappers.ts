import { REACTION_KINDS } from "@/features/reactions/constants";
import type { ReactionKind } from "@/features/reactions/types";
import { unwrapEmbedded } from "@/lib/supabase/embedded";
import { toCountMap } from "@/lib/utils/count-map";

import type { CommentRow } from "./rows";
import type { CommentDTO } from "./types";
import type { CommentPermissions } from "./utils/permissions";

type CommentExtras = {
  bodyHtml: string;
  permissions: CommentPermissions;
  myReactions: ReactionKind[];
  postAuthorIds: ReadonlySet<string>;
};

/** Row -> DTO. Internal ids and moderation columns stay on the server. */
export function toCommentDTO(row: CommentRow, { bodyHtml, permissions, myReactions, postAuthorIds }: CommentExtras): CommentDTO {
  const isDeleted = row.deleted_at !== null;
  const author = unwrapEmbedded(row.author);
  return {
    id: row.id,
    parentId: row.parent_id,
    rootId: row.root_id,
    bodyHtml: isDeleted ? "" : bodyHtml,
    bodyMd: permissions.canEdit ? row.body_md : null,
    createdAt: row.created_at,
    editedAt: row.edited_at,
    status: row.status,
    isPinned: row.is_pinned,
    isDeleted,
    isMine: permissions.isMine,
    author:
      isDeleted || !author
        ? null
        : {
            username: author.username,
            displayName: author.display_name,
            avatarUrl: author.avatar_url,
            isPostAuthor: postAuthorIds.has(row.author_id),
          },
    reactions: toCountMap(row.reaction_counts, REACTION_KINDS),
    myReactions,
    replyCount: row.reply_count,
    canEdit: permissions.canEdit,
    canDelete: permissions.canDelete,
    canPin: permissions.canPin,
    canHide: permissions.canHide,
    canReport: permissions.canReport,
  };
}
