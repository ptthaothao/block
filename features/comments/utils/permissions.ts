import { ROLE_RANK } from "@/features/auth/constants";
import type { Role } from "@/features/auth/types";

import { COMMENT_EDIT_WINDOW_MS } from "../constants";
import type { CommentStatus } from "../types";

export type Viewer = { id: string; role: Role };

type PermissionInput = {
  viewer: Viewer | null;
  authorId: string;
  status: CommentStatus;
  isDeleted: boolean;
  createdAt: string;
  /** The viewer wrote the post (or co-wrote it). */
  viewerIsPostAuthor: boolean;
  now: number;
};

export type CommentPermissions = {
  isMine: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canHide: boolean;
  canReport: boolean;
};

export function isEditorRole(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.editor;
}

/** Mirrors the rules in the comments migration, so the UI only offers what will work. */
export function commentPermissions({ viewer, authorId, status, isDeleted, createdAt, viewerIsPostAuthor, now }: PermissionInput): CommentPermissions {
  const isMine = viewer !== null && viewer.id === authorId;
  const moderator = viewer !== null && (viewerIsPostAuthor || isEditorRole(viewer.role));
  const live = !isDeleted;
  return {
    isMine,
    canEdit: isMine && live && now - new Date(createdAt).getTime() < COMMENT_EDIT_WINDOW_MS,
    canDelete: live && (isMine || moderator),
    canPin: live && moderator && status === "visible",
    canHide: live && moderator && status !== "pending",
    canReport: live && viewer !== null && !isMine && status === "visible",
  };
}
