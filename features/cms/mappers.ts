import type { SessionUser } from "@/features/auth/types";
import { hasRole } from "@/features/auth/utils/roles";
import { unwrapEmbedded } from "@/lib/supabase/embedded";

import { AUTHOR_EDITABLE_STATUSES } from "./constants";
import type { PostValues } from "./schemas";
import type {
  CmsCategoryRow,
  CmsPostListRow,
  CmsPostRow,
  CmsSavedPostRow,
  CmsSeriesRow,
  CmsTagRow,
} from "./rows";
import type { CmsCategory, CmsPost, CmsPostListItem, CmsSeries, CmsTag, SavedPost } from "./types";

export function toCmsPostListItem(row: CmsPostListRow): CmsPostListItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    reviewNote: row.review_note,
    categoryName: unwrapEmbedded(row.category)?.name ?? null,
    authorName: unwrapEmbedded(row.creator)?.display_name ?? null,
  };
}

export function toCmsPost(row: CmsPostRow, user: SessionUser): CmsPost {
  const isEditor = hasRole(user.role, "editor");
  const isAuthor = row.post_authors.some((a) => a.profile_id === user.id);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    contentMd: row.content_md,
    status: row.status,
    level: row.level,
    categoryId: row.category_id,
    seriesId: row.series_id,
    seriesPosition: row.series_position,
    coverUrl: row.cover_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    reviewNote: row.review_note,
    updatedAt: row.updated_at,
    tags: row.post_tags.flatMap(({ tag }) => {
      const t = unwrapEmbedded(tag);
      return t ? [t.name] : [];
    }),
    canEdit: isEditor || (isAuthor && AUTHOR_EDITABLE_STATUSES.includes(row.status)),
    canPublish: isEditor,
  };
}

export function toSavedPost(row: CmsSavedPostRow): SavedPost {
  return { id: row.id, slug: row.slug, status: row.status, updatedAt: row.updated_at };
}

/** Form values -> posts columns (without status, which has its own actions). */
export function toPostColumns(values: PostValues, readingMinutes: number) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content_md: values.contentMd,
    category_id: values.categoryId as number,
    level: values.level,
    series_id: values.seriesId,
    series_position: values.seriesId ? values.seriesPosition : null,
    cover_url: values.coverUrl,
    seo_title: values.seoTitle,
    seo_description: values.seoDescription,
    reading_minutes: readingMinutes,
  };
}

export function toCmsCategory(row: CmsCategoryRow): CmsCategory {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    color: row.color,
    position: row.position,
    postCount: row.posts[0]?.count ?? 0,
  };
}

export function toCmsTag(row: CmsTagRow): CmsTag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    postCount: row.post_tags[0]?.count ?? 0,
  };
}

export function toCmsSeries(row: CmsSeriesRow): CmsSeries {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverUrl: row.cover_url,
    postCount: row.posts[0]?.count ?? 0,
  };
}
