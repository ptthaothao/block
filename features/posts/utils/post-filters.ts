import { QUERY_PARAMS } from "@/config/routes";

import { EMPTY_POST_FILTERS, POST_LEVEL_VALUES, POST_LIMITS, URL_SLUG_PATTERN } from "../constants";
import type { PostFilters, PostLevel } from "../types";

type SearchParams = Record<string, string | string[] | undefined>;

function all(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function first(value: string | string[] | undefined): string | undefined {
  return all(value)[0];
}

function slug(value: string | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized && URL_SLUG_PATTERN.test(normalized) ? normalized : null;
}

function isLevel(value: string): value is PostLevel {
  return (POST_LEVEL_VALUES as readonly string[]).includes(value);
}

/** Page numbers in the URL are 1-based; anything invalid means the first page. */
export function parsePage(value: string | string[] | undefined): number {
  const n = Number(first(value));
  return Number.isInteger(n) && n > 1 ? n - 1 : 0;
}

/** Read filters from a query string, dropping anything malformed. */
export function parsePostFilters(params: SearchParams): PostFilters {
  const tags = [...new Set(all(params[QUERY_PARAMS.tag]).map(slug).filter((t): t is string => t !== null))];
  const levels = [...new Set(all(params[QUERY_PARAMS.level]).filter(isLevel))];
  return {
    topic: slug(first(params[QUERY_PARAMS.topic])),
    tags: tags.slice(0, POST_LIMITS.filterTags).sort(),
    levels: POST_LEVEL_VALUES.filter((level) => levels.includes(level)),
    author: slug(first(params[QUERY_PARAMS.author])),
    page: parsePage(params[QUERY_PARAMS.page]),
  };
}

/** `basePath?query` for these filters; defaults are left out so URLs stay short. */
export function buildFilterHref(basePath: string, filters: PostFilters): string {
  const params = new URLSearchParams();
  if (filters.topic) params.set(QUERY_PARAMS.topic, filters.topic);
  for (const tag of filters.tags) params.append(QUERY_PARAMS.tag, tag);
  for (const level of filters.levels) params.append(QUERY_PARAMS.level, level);
  if (filters.author) params.set(QUERY_PARAMS.author, filters.author);
  if (filters.page > 0) params.set(QUERY_PARAMS.page, String(filters.page + 1));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

/** Changing any filter goes back to the first page. */
export const filterChanges = {
  topic: (filters: PostFilters, topic: string | null): PostFilters => ({
    ...filters,
    topic: filters.topic === topic ? null : topic,
    page: 0,
  }),
  tag: (filters: PostFilters, tag: string): PostFilters => ({ ...filters, tags: toggle(filters.tags, tag).sort(), page: 0 }),
  level: (filters: PostFilters, level: PostLevel): PostFilters => ({
    ...filters,
    levels: POST_LEVEL_VALUES.filter((l) => toggle(filters.levels, level).includes(l)),
    page: 0,
  }),
  author: (filters: PostFilters, author: string | null): PostFilters => ({
    ...filters,
    author: filters.author === author ? null : author,
    page: 0,
  }),
  page: (filters: PostFilters, page: number): PostFilters => ({ ...filters, page }),
  clear: (): PostFilters => EMPTY_POST_FILTERS,
};

/** Number of active filters, for the mobile "Lọc (n)" button. */
export function countActiveFilters(filters: PostFilters): number {
  return (filters.topic ? 1 : 0) + filters.tags.length + filters.levels.length + (filters.author ? 1 : 0);
}

/** Stable cache key for a set of filters. */
export function postFiltersKey(filters: PostFilters): string {
  return JSON.stringify([filters.topic, filters.tags, filters.levels, filters.author, filters.page]);
}
