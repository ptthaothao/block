"use server";

import { authorize } from "@/features/auth/guards";
import { hasRole } from "@/features/auth/utils/roles";
import { renderMarkdown } from "@/lib/markdown/render";
import { estimateReadingMinutes } from "@/lib/markdown/reading-time";
import { createClient } from "@/lib/supabase/server";
import type { Json, TablesUpdate } from "@/types/database";

import { CMS_ERROR_MESSAGES } from "../constants";
import { toPostColumns, toSavedPost } from "../mappers";
import { postIdSchema, postInputSchema, reviewNoteSchema, type PostInput } from "../schemas";
import { CMS_SAVED_POST_SELECT } from "../selects";
import { syncPostTags } from "../services/post-tags";
import { refreshPublicPost } from "../services/revalidate";
import type { ActionResult } from "@/lib/actions/types";

import type { SavedPost } from "../types";
import { fail, firstIssue, ok } from "@/lib/actions/result";
import { describeDbError } from "../utils/action-error";

/** Create (id = null) or update a post's content. Status changes have their own actions. */
export async function savePost(id: string | null, input: PostInput): Promise<ActionResult<SavedPost>> {
  const user = await authorize("author");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);

  const parsed = postInputSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));
  if (id !== null && !postIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.notFound);

  const values = parsed.data;
  const columns = toPostColumns(values, estimateReadingMinutes(values.contentMd));
  const supabase = await createClient();

  const { data, error } =
    id === null
      ? await supabase
          .from("posts")
          .insert({ ...columns, status: "draft", created_by: user.id })
          .select(CMS_SAVED_POST_SELECT)
          .single()
      : await supabase.from("posts").update(columns).eq("id", id).select(CMS_SAVED_POST_SELECT).maybeSingle();
  if (error) return fail(describeDbError(error));
  if (!data) return fail(CMS_ERROR_MESSAGES.notFound);

  const tagError = await syncPostTags(supabase, user, data.id, values.tags);
  if (tagError) return fail(describeDbError(tagError));

  // Editors may fix a live post: keep its rendered HTML and cached pages in sync.
  if (data.status === "published") {
    const rendered = await renderMarkdown(values.contentMd);
    const { error: renderError } = await supabase
      .from("posts")
      .update({ content_html: rendered.html, toc: rendered.toc as NonNullable<Json>, reading_minutes: rendered.readingMinutes })
      .eq("id", data.id);
    if (renderError) return fail(describeDbError(renderError));
    refreshPublicPost(data.slug);
  }

  return ok(toSavedPost(data));
}

export async function submitForReview(id: string): Promise<ActionResult<SavedPost>> {
  const user = await authorize("author");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  return updateStatus(id, { status: "review" });
}

export async function publishPost(id: string): Promise<ActionResult<SavedPost>> {
  const user = await authorize("editor");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (!postIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.notFound);

  const supabase = await createClient();
  const { data: post, error } = await supabase.from("posts").select("content_md").eq("id", id).maybeSingle();
  if (error) return fail(describeDbError(error));
  if (!post) return fail(CMS_ERROR_MESSAGES.notFound);

  const rendered = await renderMarkdown(post.content_md);
  const result = await updateStatus(id, {
    status: "published",
    content_html: rendered.html,
    toc: rendered.toc as NonNullable<Json>,
    reading_minutes: rendered.readingMinutes,
    review_note: null,
  });
  if (result.ok) refreshPublicPost(result.data.slug);
  return result;
}

export async function returnToAuthor(id: string, note: string): Promise<ActionResult<SavedPost>> {
  const user = await authorize("editor");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  const parsedNote = reviewNoteSchema.safeParse(note);
  if (!parsedNote.success) return fail(firstIssue(parsedNote.error.issues));
  return updateStatus(id, { status: "draft", review_note: parsedNote.data });
}

export async function unpublishPost(id: string): Promise<ActionResult<SavedPost>> {
  const user = await authorize("editor");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  const result = await updateStatus(id, { status: "draft" });
  if (result.ok) refreshPublicPost(result.data.slug);
  return result;
}

export async function deletePost(id: string): Promise<ActionResult<null>> {
  const user = await authorize("author");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (!postIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.notFound);

  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").delete().eq("id", id).select("slug, status").maybeSingle();
  if (error) return fail(describeDbError(error));
  if (!data) return fail(CMS_ERROR_MESSAGES.notFound);
  if (data.status === "published" && hasRole(user.role, "editor")) refreshPublicPost(data.slug);
  return ok(null);
}

type StatusUpdate = Pick<TablesUpdate<"posts">, "content_html" | "toc" | "reading_minutes" | "review_note"> & {
  status: SavedPost["status"];
};

async function updateStatus(id: string, patch: StatusUpdate): Promise<ActionResult<SavedPost>> {
  if (!postIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.notFound);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", id)
    .select(CMS_SAVED_POST_SELECT)
    .maybeSingle();
  if (error) return fail(describeDbError(error));
  if (!data) return fail(CMS_ERROR_MESSAGES.notFound);
  return ok(toSavedPost(data));
}
