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
import { toCategoryTree, toPostDetail, toPostSummary } from "./mappers";
import type { CategoryRow, PostDetailRow, PostSummaryRow } from "./rows";
import { CATEGORY_TREE_SELECT, POST_DETAIL_SELECT, POST_SLUG_SELECT, POST_SUMMARY_SELECT } from "./selects";
import type { CategoryNode, PostDetail, PostSummary } from "./types";

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
 * One page of published posts, newest first. Each distinct `page` gets its
 * own Data Cache entry (still ISR: no cookies are read), so older posts
 * beyond POST_LIMITS.list stay reachable and indexable through /posts?page=N
 * instead of only the first page ever being listed.
 */
export const getPostsPage = unstable_cache(
  async (page: number): Promise<PostListPage> => {
    const supabase = getPublicClient();
    if (!supabase) return { items: [], total: 0 };
    const from = page * POST_LIMITS.list;
    const to = from + POST_LIMITS.list - 1;
    const { data, error, count } = await supabase
      .from("posts")
      .select(POST_SUMMARY_SELECT, { count: "exact" })
      .eq("status", PUBLISHED_STATUS)
      .order("published_at", { ascending: false })
      .range(from, to)
      .overrideTypes<PostSummaryRow[], { merge: false }>();
    // PostgREST returns PGRST103 when `from` is past the last row (e.g. a
    // stale/guessed ?page= value) rather than an empty result; treat that as
    // an empty, last page instead of a real error. `count` isn't returned
    // alongside this error, so report `from` as the total to keep
    // hasNextPage false without a second round-trip just to get the count.
    if (error?.code === "PGRST103") return { items: [], total: from };
    if (error) throw new Error(`getPostsPage: ${error.message}`);
    return { items: data.map(toPostSummary), total: count ?? 0 };
  },
  [POST_CACHE_KEYS.list],
  { tags: [POST_CACHE_TAGS.posts], revalidate: POST_REVALIDATE_SECONDS },
);

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

export const getCategoryTree = unstable_cache(
  async (): Promise<CategoryNode[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from("categories").select(CATEGORY_TREE_SELECT).order("position");
    if (error) throw new Error(`getCategoryTree: ${error.message}`);
    return toCategoryTree(data as CategoryRow[]);
  },
  [POST_CACHE_KEYS.categoryTree],
  { tags: [POST_CACHE_TAGS.categories], revalidate: POST_REVALIDATE_SECONDS },
);
