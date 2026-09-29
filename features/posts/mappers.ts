import type { RenderedMarkdown } from "@/lib/markdown/types";
import { unwrapEmbedded } from "@/lib/supabase/embedded";

import type { PostDetailRow, PostSummaryRow } from "./rows";
import type { AuthorRef, PostDetail, PostSummary, TagRef } from "./types";

function toAuthors(rows: PostSummaryRow["post_authors"]): AuthorRef[] {
  return [...rows]
    .sort((a, b) => a.position - b.position)
    .flatMap(({ profile }) => {
      const p = unwrapEmbedded(profile);
      return p ? [{ username: p.username, displayName: p.display_name, avatarUrl: p.avatar_url }] : [];
    });
}

function toTags(rows: PostSummaryRow["post_tags"]): TagRef[] {
  return rows.flatMap(({ tag }) => {
    const t = unwrapEmbedded(tag);
    return t ? [{ slug: t.slug, name: t.name }] : [];
  });
}

export function toPostSummary(row: PostSummaryRow): PostSummary {
  const category = unwrapEmbedded(row.category);
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverUrl: row.cover_url,
    level: row.level,
    readingMinutes: row.reading_minutes,
    publishedAt: row.published_at,
    category: category
      ? { slug: category.slug, name: category.name, color: category.color, parent: unwrapEmbedded(category.parent) }
      : null,
    authors: toAuthors(row.post_authors),
    tags: toTags(row.post_tags),
  };
}

export function toPostDetail(row: PostDetailRow, content: Pick<RenderedMarkdown, "html" | "toc">): PostDetail {
  const series = unwrapEmbedded(row.series);
  return {
    ...toPostSummary(row),
    html: content.html,
    toc: content.toc,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    updatedAt: row.updated_at,
    series: series ? { ...series, position: row.series_position } : null,
  };
}
