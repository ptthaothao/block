"use server";

import { authorize } from "@/features/auth/guards";
import { createClient } from "@/lib/supabase/server";

import { CMS_ERROR_MESSAGES } from "../constants";
import {
  categoryInputSchema,
  entityIdSchema,
  mergeTagsSchema,
  seriesInputSchema,
  tagInputSchema,
  type CategoryInput,
  type SeriesInput,
  type TagInput,
} from "../schemas";
import { refreshPublicTaxonomy } from "../services/revalidate";
import type { ActionResult } from "@/lib/actions/types";
import { fail, firstIssue, ok } from "@/lib/actions/result";
import { describeDbError } from "../utils/action-error";

type Result = ActionResult<null>;

async function requireEditor() {
  return (await authorize("editor")) !== null;
}

function done(error: { code?: string; message: string } | null): Result {
  if (error) return fail(describeDbError(error));
  refreshPublicTaxonomy();
  return ok(null);
}

export async function saveCategory(input: CategoryInput): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const { id, parentId, ...rest } = parsed.data;
  const row = { ...rest, parent_id: parentId };
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  return done(error);
}

export async function deleteCategory(id: number): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (!entityIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.invalid);
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return done(error);
}

export async function saveTag(input: TagInput): Promise<Result> {
  const user = await authorize("editor");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  const parsed = tagInputSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const { id, ...row } = parsed.data;
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("tags").update(row).eq("id", id)
    : await supabase.from("tags").insert({ ...row, created_by: user.id });
  return done(error);
}

export async function deleteTag(id: number): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (!entityIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.invalid);
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  return done(error);
}

export async function mergeTags(sourceId: number, targetId: number): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  const parsed = mergeTagsSchema.safeParse({ sourceId, targetId });
  if (!parsed.success || sourceId === targetId) return fail(CMS_ERROR_MESSAGES.invalid);
  const supabase = await createClient();
  const { error } = await supabase.rpc("merge_tags", { p_source: sourceId, p_target: targetId });
  return done(error);
}

export async function saveSeries(input: SeriesInput): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  const parsed = seriesInputSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const { id, coverUrl, ...rest } = parsed.data;
  const row = { ...rest, cover_url: coverUrl };
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("series").update(row).eq("id", id)
    : await supabase.from("series").insert(row);
  return done(error);
}

export async function deleteSeries(id: number): Promise<Result> {
  if (!(await requireEditor())) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (!entityIdSchema.safeParse(id).success) return fail(CMS_ERROR_MESSAGES.invalid);
  const supabase = await createClient();
  const { error } = await supabase.from("series").delete().eq("id", id);
  return done(error);
}
