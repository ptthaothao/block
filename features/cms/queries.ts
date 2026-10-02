import "server-only";

import type { SessionUser } from "@/features/auth/types";
import { hasRole } from "@/features/auth/utils/roles";
import { createClient } from "@/lib/supabase/server";

import { CMS_LIMITS } from "./constants";
import { toCmsCategory, toCmsPost, toCmsPostListItem, toCmsSeries, toCmsTag } from "./mappers";
import type { CmsCategoryRow, CmsPostListRow, CmsPostRow, CmsSeriesRow, CmsTagRow } from "./rows";
import {
  CMS_CATEGORY_SELECT,
  CMS_MY_POST_LIST_SELECT,
  CMS_POST_LIST_SELECT,
  CMS_POST_SELECT,
  CMS_SERIES_SELECT,
  CMS_TAG_SELECT,
} from "./selects";
import type { CmsPost, CmsPostListItem, CmsPostPage, CmsTaxonomy, PostStatus } from "./types";

/** Editors see every post; authors see the posts they (co-)author. One page of CMS_LIMITS.postList rows, starting at `offset`. */
export async function listCmsPosts(user: SessionUser, status: PostStatus | null, offset = 0): Promise<CmsPostPage> {
  const supabase = await createClient();
  const isEditor = hasRole(user.role, "editor");

  let query = supabase
    .from("posts")
    .select(isEditor ? CMS_POST_LIST_SELECT : CMS_MY_POST_LIST_SELECT)
    .order("updated_at", { ascending: false })
    .range(offset, offset + CMS_LIMITS.postList - 1);
  if (!isEditor) query = query.eq("post_authors.profile_id", user.id);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.overrideTypes<CmsPostListRow[], { merge: false }>();
  if (error) throw new Error(`listCmsPosts: ${error.message}`);
  return {
    items: data.map(toCmsPostListItem),
    nextOffset: data.length === CMS_LIMITS.postList ? offset + CMS_LIMITS.postList : null,
  };
}

export async function listReviewPosts(): Promise<CmsPostListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(CMS_POST_LIST_SELECT)
    .eq("status", "review")
    .order("updated_at", { ascending: true })
    .limit(CMS_LIMITS.postList)
    .overrideTypes<CmsPostListRow[], { merge: false }>();
  if (error) throw new Error(`listReviewPosts: ${error.message}`);
  return data.map(toCmsPostListItem);
}

export async function getCmsPost(user: SessionUser, id: string): Promise<CmsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(CMS_POST_SELECT)
    .eq("id", id)
    .maybeSingle()
    .overrideTypes<CmsPostRow, { merge: false }>();
  if (error) throw new Error(`getCmsPost: ${error.message}`);
  return data ? toCmsPost(data, user) : null;
}

export async function getCmsTaxonomy(): Promise<CmsTaxonomy> {
  const supabase = await createClient();
  const [categories, tags, series] = await Promise.all([
    supabase
      .from("categories")
      .select(CMS_CATEGORY_SELECT)
      .order("position")
      .overrideTypes<CmsCategoryRow[], { merge: false }>(),
    supabase.from("tags").select(CMS_TAG_SELECT).order("name").overrideTypes<CmsTagRow[], { merge: false }>(),
    supabase.from("series").select(CMS_SERIES_SELECT).order("title").overrideTypes<CmsSeriesRow[], { merge: false }>(),
  ]);
  const error = categories.error ?? tags.error ?? series.error;
  if (error) throw new Error(`getCmsTaxonomy: ${error.message}`);

  return {
    categories: (categories.data ?? []).map(toCmsCategory),
    tags: (tags.data ?? []).map(toCmsTag),
    series: (series.data ?? []).map(toCmsSeries),
  };
}
