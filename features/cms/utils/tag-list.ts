import type { CmsTag, TagSort, TagStatus, TagStatusFilter } from "../types";

/** Tags whose name or slug contains `query`, limited to one status unless "all". */
export function filterTags(tags: CmsTag[], query: string, status: TagStatusFilter): CmsTag[] {
  const needle = query.trim().toLowerCase();
  return tags.filter(
    (tag) =>
      (status === "all" || tag.status === status) &&
      (!needle || tag.name.toLowerCase().includes(needle) || tag.slug.includes(needle)),
  );
}

/** Most-used first (ties by name), or by name. */
export function sortTags(tags: CmsTag[], sort: TagSort): CmsTag[] {
  const byName = (a: CmsTag, b: CmsTag) => a.name.localeCompare(b.name);
  return [...tags].sort(sort === "posts" ? (a, b) => b.postCount - a.postCount || byName(a, b) : byName);
}

export function countTagsByStatus(tags: CmsTag[]): Record<TagStatusFilter, number> {
  const counts: Record<TagStatus, number> = { pending: 0, approved: 0 };
  for (const tag of tags) counts[tag.status] += 1;
  return { all: tags.length, ...counts };
}
