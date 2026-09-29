import type { AuthorCountRow, TagCountRow, TagRow, TopicCountRow, TopicRow } from "./rows";
import type { AuthorOption, TagSummary, TopicPage, TopicSummary } from "./types";

function countsById<T extends { post_count: number }>(rows: T[], id: (row: T) => number): Map<number, number> {
  return new Map(rows.map((row) => [id(row), row.post_count]));
}

/** Top-level topics with their children, in CMS order (rows arrive sorted by position). */
export function toTopicTree(rows: TopicRow[], counts: TopicCountRow[]): TopicSummary[] {
  const countOf = countsById(counts, (row) => row.category_id);
  return rows
    .filter((row) => row.parent_id === null)
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      postCount: countOf.get(row.id) ?? 0,
      children: rows
        .filter((child) => child.parent_id === row.id)
        .map((child) => ({ slug: child.slug, name: child.name, postCount: countOf.get(child.id) ?? 0 })),
    }));
}

/** Find a topic (top-level or child) in the tree. Children inherit the parent's look. */
export function findTopicPage(tree: TopicSummary[], slug: string): TopicPage | null {
  for (const root of tree) {
    if (root.slug === slug) {
      return {
        slug: root.slug,
        name: root.name,
        description: root.description,
        icon: root.icon,
        color: root.color,
        postCount: root.postCount,
        parent: null,
        root,
      };
    }
    const child = root.children.find((c) => c.slug === slug);
    if (child) {
      return {
        ...child,
        description: null,
        icon: root.icon,
        color: root.color,
        parent: { slug: root.slug, name: root.name },
        root,
      };
    }
  }
  return null;
}

/** Approved tags, most used first, then by name. */
export function toTagSummaries(rows: TagRow[], counts: TagCountRow[]): TagSummary[] {
  const countOf = countsById(counts, (row) => row.tag_id);
  return rows
    .filter((row) => countOf.has(row.id))
    .map((row) => ({ slug: row.slug, name: row.name, postCount: countOf.get(row.id) ?? 0 }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

export function toAuthorOption(row: AuthorCountRow): AuthorOption {
  return {
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    postCount: row.post_count,
  };
}
