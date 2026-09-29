import type { AuthorOption, TagSummary, TopicSummary } from "@/features/topics/types";

import { POST_LEVELS } from "../constants";
import type { PostFilters } from "../types";
import { filterChanges } from "./post-filters";

export type ActiveFilter = { key: string; label: string; without: PostFilters };

type Lookups = { topics: TopicSummary[]; tags: TagSummary[]; authors: AuthorOption[] };

function topicName(topics: TopicSummary[], slug: string): string {
  for (const topic of topics) {
    if (topic.slug === slug) return topic.name;
    const child = topic.children.find((c) => c.slug === slug);
    if (child) return `${topic.name} › ${child.name}`;
  }
  return slug;
}

/** One removable chip per active filter, with the filters that remain once it is removed. */
export function listActiveFilters(filters: PostFilters, { topics, tags, authors }: Lookups): ActiveFilter[] {
  const chips: ActiveFilter[] = [];
  if (filters.topic) {
    chips.push({ key: `topic:${filters.topic}`, label: topicName(topics, filters.topic), without: filterChanges.topic(filters, filters.topic) });
  }
  for (const slug of filters.tags) {
    const name = tags.find((t) => t.slug === slug)?.name ?? slug;
    chips.push({ key: `tag:${slug}`, label: `#${name}`, without: filterChanges.tag(filters, slug) });
  }
  if (filters.author) {
    const name = authors.find((a) => a.username === filters.author)?.displayName ?? filters.author;
    chips.push({ key: `author:${filters.author}`, label: name, without: filterChanges.author(filters, filters.author) });
  }
  for (const level of filters.levels) {
    chips.push({ key: `level:${level}`, label: POST_LEVELS[level].label, without: filterChanges.level(filters, level) });
  }
  return chips;
}
