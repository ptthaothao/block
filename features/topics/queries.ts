import "server-only";

import { unstable_cache } from "next/cache";

import { POST_CACHE_TAGS, POST_REVALIDATE_SECONDS } from "@/features/posts/constants";
import { getPublicClient } from "@/lib/supabase/public";

import { TOPIC_CACHE_KEYS } from "./constants";
import { findTopicPage, toAuthorOption, toTagSummaries, toTopicTree } from "./mappers";
import { TAG_SELECT, TOPIC_SELECT } from "./selects";
import type { AuthorOption, TagSummary, TopicPage, TopicSummary } from "./types";

// Counts change when a post is published (tag `posts`) and names when the
// taxonomy is edited (tag `categories`); the CMS expires both.
const CACHE_OPTIONS = {
  tags: [POST_CACHE_TAGS.posts, POST_CACHE_TAGS.categories],
  revalidate: POST_REVALIDATE_SECONDS,
};

export const getTopicTree = unstable_cache(
  async (): Promise<TopicSummary[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const [topics, counts] = await Promise.all([
      supabase.from("categories").select(TOPIC_SELECT).order("position").order("name"),
      supabase.rpc("category_post_counts"),
    ]);
    const error = topics.error ?? counts.error;
    if (error) throw new Error(`getTopicTree: ${error.message}`);
    return toTopicTree(topics.data ?? [], counts.data ?? []);
  },
  [TOPIC_CACHE_KEYS.tree],
  CACHE_OPTIONS,
);

export async function getTopicPage(slug: string): Promise<TopicPage | null> {
  return findTopicPage(await getTopicTree(), slug);
}

export const getTagSummaries = unstable_cache(
  async (): Promise<TagSummary[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const [tags, counts] = await Promise.all([
      supabase.from("tags").select(TAG_SELECT).eq("status", "approved"),
      supabase.rpc("tag_post_counts"),
    ]);
    const error = tags.error ?? counts.error;
    if (error) throw new Error(`getTagSummaries: ${error.message}`);
    return toTagSummaries(tags.data ?? [], counts.data ?? []);
  },
  [TOPIC_CACHE_KEYS.tags],
  CACHE_OPTIONS,
);

export async function getTagSummary(slug: string): Promise<TagSummary | null> {
  return (await getTagSummaries()).find((tag) => tag.slug === slug) ?? null;
}

export const getAuthorOptions = unstable_cache(
  async (): Promise<AuthorOption[]> => {
    const supabase = getPublicClient();
    if (!supabase) return [];
    const { data, error } = await supabase.rpc("author_post_counts");
    if (error) throw new Error(`getAuthorOptions: ${error.message}`);
    return data.map(toAuthorOption);
  },
  [TOPIC_CACHE_KEYS.authors],
  CACHE_OPTIONS,
);
