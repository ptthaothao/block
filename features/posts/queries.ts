import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { renderMarkdown } from "@/lib/markdown/render";
import type { TocItem } from "@/lib/markdown/types";
import { getPublicClient } from "@/lib/supabase/public";

import {
  POST_CACHE_KEYS,
  POST_CACHE_TAGS,
  POST_LIMITS,
  POST_REVALIDATE_SECONDS,
  PUBLISHED_STATUS,
} from "./constants";
import { toPostDetail, toPostSummary } from "./mappers";
import type { PostDetailRow, PostSummaryRow } from "./rows";
import { POST_DETAIL_SELECT, POST_SLUG_SELECT, POST_SUMMARY_SELECT } from "./selects";
import type { PostDetail, PostFilters, PostSummary } from "./types";
import { orderByIds } from "./utils/order-by-ids";
import { postFiltersKey } from "./utils/post-filters";

export const getLatestPosts = unstable_cache(
  async (limit: number = POST_LIMITS.list): Promise<PostSummary[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SUMMARY_SELECT)
      .eq("status", PUBLISHED_STATUS)
      .order("published_at", { ascending: false })
      .limit(limit)
      .overrideTypes<PostSummaryRow[], { merge: false }>();
    if (error) throw new Error(`getLatestPosts: ${error.message}`);
    return data.map(toPostSummary);
  },
  [POST_CACHE_KEYS.latest],
  { tags: [POST_CACHE_TAGS.posts], revalidate: POST_REVALIDATE_SECONDS },
);

export type PostListPage = { items: PostSummary[]; total: number };

/**
 * One page of published posts matching `filters`, newest first. Each distinct
 * set of filters gets its own Data Cache entry (no cookies are read, so it is
 * shared by every visitor) and expires with the `posts` tag on publish.
 */
export function getFilteredPosts(filters: PostFilters): Promise<PostListPage> {
  return unstable_cache(
    async (): Promise<PostListPage> => {
      const supabase = getPublicClient();
      if (!supabase) return { items: [], total: 0 };
      const { data: matches, error } = await supabase.rpc("filter_posts", {
        p_category: filters.topic ?? undefined,
        p_tags: filters.tags.length > 0 ? filters.tags : undefined,
        p_levels: filters.levels.length > 0 ? filters.levels : undefined,
        p_author: filters.author ?? undefined,
        p_limit: POST_LIMITS.list,
        p_offset: filters.page * POST_LIMITS.list,
      });
      if (error) throw new Error(`getFilteredPosts: ${error.message}`);
      if (matches.length === 0) return { items: [], total: 0 };

      const ids = matches.map((m) => m.id);
      const { data, error: rowsError } = await supabase
        .from("posts")
        .select(POST_SUMMARY_SELECT)
        .in("id", ids)
        .overrideTypes<PostSummaryRow[], { merge: false }>();
      if (rowsError) throw new Error(`getFilteredPosts: ${rowsError.message}`);
      return { items: orderByIds(data, ids).map(toPostSummary), total: matches[0].total_count };
    },
    [POST_CACHE_KEYS.filtered, postFiltersKey(filters)],
    { tags: [POST_CACHE_TAGS.posts], revalidate: POST_REVALIDATE_SECONDS },
  )();
}

export const getPublishedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SLUG_SELECT)
      .eq("status", PUBLISHED_STATUS)
      .order("published_at", { ascending: false })
      .limit(POST_LIMITS.staticParams);
    if (error) throw new Error(`getPublishedSlugs: ${error.message}`);
    return data.map((row) => row.slug);
  },
  [POST_CACHE_KEYS.slugs],
  { tags: [POST_CACHE_TAGS.posts], revalidate: POST_REVALIDATE_SECONDS },
);

/**
 * Wrapped in React's cache() (in addition to unstable_cache below) so
 * generateMetadata and the page component - which both call this for the
 * same slug - share one call within a single render pass, instead of racing
 * two Supabase round-trips when the Data Cache entry is missing/stale.
 */
export const getPostBySlug = cache((slug: string): Promise<PostDetail | null> => {
  return unstable_cache(
    async (): Promise<PostDetail | null> => {
      const supabase = getPublicClient();
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("posts")
        .select(POST_DETAIL_SELECT)
        .eq("status", PUBLISHED_STATUS)
        .eq("slug", slug)
        .maybeSingle()
        .overrideTypes<PostDetailRow, { merge: false }>();
      if (error) throw new Error(`getPostBySlug: ${error.message}`);
      if (!data) return null;

      // Posts are normally rendered on publish. Fall back to rendering here
      // (still cached) for rows written without HTML, such as seed data.
      const content =
        data.content_html != null
          ? { html: data.content_html, toc: (data.toc as TocItem[]) ?? [] }
          : await renderMarkdown(data.content_md);
      return toPostDetail(data, content);
    },
    [POST_CACHE_KEYS.detail, slug],
    { tags: [POST_CACHE_TAGS.posts, POST_CACHE_TAGS.post(slug)], revalidate: POST_REVALIDATE_SECONDS },
  )();
});
