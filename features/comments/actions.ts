"use server";

import { authorize } from "@/features/auth/guards";
import { COMMON_ERROR_MESSAGES, PG_ERROR_CODES } from "@/lib/actions/constants";
import { fail, firstIssue, ok } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/types";
import { renderCommentMarkdown } from "@/lib/markdown/render-comment";
import { createClient } from "@/lib/supabase/server";

import { getCommentForViewer, getPostContext } from "./queries";
import { commentEditSchema, commentIdSchema, commentReportSchema, newCommentSchema, previewSchema } from "./schemas";
import type { CommentDTO, CommentEdit, CommentReport, NewComment } from "./types";

type Result<T = null> = ActionResult<T>;

function dbError(error: { code?: string }): Result<never> {
  if (error.code === PG_ERROR_CODES.rateLimited) return fail(COMMON_ERROR_MESSAGES.rateLimited);
  if (error.code === PG_ERROR_CODES.insufficientPrivilege) return fail(COMMON_ERROR_MESSAGES.forbidden);
  if (error.code === PG_ERROR_CODES.noDataFound) return fail(COMMON_ERROR_MESSAGES.notFound);
  return fail(COMMON_ERROR_MESSAGES.unknown);
}

/** The comment as the viewer should now see it, or a failure if it vanished. */
async function freshComment(id: string): Promise<Result<CommentDTO>> {
  const comment = await getCommentForViewer(id);
  return comment ? ok(comment) : fail(COMMON_ERROR_MESSAGES.notFound);
}

/** Write a comment or reply. Returns it rendered, so the list can show it right away (possibly "pending"). */
export async function createComment(input: NewComment): Promise<Result<CommentDTO>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = newCommentSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const context = await getPostContext(supabase, parsed.data.postSlug);
  if (!context) return fail(COMMON_ERROR_MESSAGES.notFound);

  const { data, error } = await supabase
    .rpc("create_comment", { p_post_id: context.postId, p_body_md: parsed.data.body, p_parent_id: parsed.data.parentId ?? undefined })
    .single();
  if (error) return dbError(error);
  return freshComment(data.id);
}

export async function editComment(input: CommentEdit): Promise<Result<CommentDTO>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = commentEditSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const { data, error } = await supabase.from("comments").update({ body_md: parsed.data.body }).eq("id", parsed.data.id).select("id");
  if (error) return dbError(error);
  if (data.length === 0) return fail(COMMON_ERROR_MESSAGES.forbidden);
  return freshComment(parsed.data.id);
}

/** Soft delete: the text goes, the place (and its replies) stay. */
export async function deleteComment(id: string): Promise<Result<CommentDTO>> {
  return updateAs(id, { deleted_at: new Date().toISOString() });
}

export async function setCommentPinned({ id, pinned }: { id: string; pinned: boolean }): Promise<Result<CommentDTO>> {
  return updateAs(id, { is_pinned: pinned });
}

/** Hide or show again (post author or editor). */
export async function setCommentHidden({ id, hidden }: { id: string; hidden: boolean }): Promise<Result<CommentDTO>> {
  return updateAs(id, { status: hidden ? "hidden" : "visible" });
}

async function updateAs(
  id: string,
  values: { deleted_at?: string; is_pinned?: boolean; status?: "visible" | "hidden" },
): Promise<Result<CommentDTO>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = commentIdSchema.safeParse(id);
  if (!parsed.success) return fail(COMMON_ERROR_MESSAGES.invalid);

  const supabase = await createClient();
  const { data, error } = await supabase.from("comments").update(values).eq("id", parsed.data).select("id");
  if (error) return dbError(error);
  if (data.length === 0) return fail(COMMON_ERROR_MESSAGES.forbidden);
  return freshComment(parsed.data);
}

export async function reportComment(input: CommentReport): Promise<Result> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = commentReportSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .insert({ comment_id: parsed.data.id, reason: parsed.data.reason, note: parsed.data.note || null });
  // Reporting twice is fine from the reader's point of view.
  if (error && error.code !== PG_ERROR_CODES.uniqueViolation) return dbError(error);
  return ok(null);
}

/** Render the composer's "Xem trước" tab with the same pipeline as published comments. */
export async function previewComment(body: string): Promise<Result<string>> {
  const parsed = previewSchema.safeParse(body);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));
  return ok(await renderCommentMarkdown(parsed.data));
}

// ---------------------------------------------------------------------------
// Moderation (/cms/moderation, editors)
// ---------------------------------------------------------------------------

async function resolveReports(commentId: string, editorId: string) {
  const supabase = await createClient();
  return supabase
    .from("reports")
    .update({ resolved_by: editorId, resolved_at: new Date().toISOString() })
    .eq("comment_id", commentId)
    .is("resolved_at", null);
}

async function moderate(commentId: string, status: "visible" | "hidden" | null): Promise<Result> {
  const editor = await authorize("editor");
  if (!editor) return fail(COMMON_ERROR_MESSAGES.forbidden);
  const parsed = commentIdSchema.safeParse(commentId);
  if (!parsed.success) return fail(COMMON_ERROR_MESSAGES.invalid);

  if (status) {
    const supabase = await createClient();
    const { error } = await supabase.from("comments").update({ status }).eq("id", parsed.data);
    if (error) return dbError(error);
  }
  const { error } = await resolveReports(parsed.data, editor.id);
  return error ? dbError(error) : ok(null);
}

export async function approveComment(commentId: string): Promise<Result> {
  return moderate(commentId, "visible");
}

export async function hideReportedComment(commentId: string): Promise<Result> {
  return moderate(commentId, "hidden");
}

/** Keep the comment as it is and close its reports. */
export async function dismissReports(commentId: string): Promise<Result> {
  return moderate(commentId, null);
}
