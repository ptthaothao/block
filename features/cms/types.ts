import type { Enums } from "@/types/database";

export type PostStatus = Enums<"post_status">;
export type PostLevel = Enums<"post_level">;
export type TagStatus = Enums<"tag_status">;

export type CmsPostListItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  updatedAt: string;
  publishedAt: string | null;
  reviewNote: string | null;
  categoryName: string | null;
  authorName: string | null;
};

export type CmsPostPage = { items: CmsPostListItem[]; nextOffset: number | null };

export type SavedPost = { id: string; slug: string; status: PostStatus; updatedAt: string };

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentMd: string;
  status: PostStatus;
  level: PostLevel;
  categoryId: number;
  seriesId: number | null;
  seriesPosition: number | null;
  coverUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  reviewNote: string | null;
  updatedAt: string;
  tags: string[];
  /** Computed on the server so the UI never decides permissions itself. */
  canEdit: boolean;
  canPublish: boolean;
};

export type CmsCategory = {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  position: number;
};

export type CmsTag = {
  id: number;
  name: string;
  slug: string;
  status: TagStatus;
  postCount: number;
};

export type CmsSeries = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
};

export type CmsTaxonomy = {
  categories: CmsCategory[];
  tags: CmsTag[];
  series: CmsSeries[];
};

/** Editor form state: like PostInput, but tags are typed as one string. */
export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  contentMd: string;
  categoryId: number | null;
  level: PostLevel;
  seriesId: number | null;
  seriesPosition: number | null;
  coverUrl: string;
  seoTitle: string;
  seoDescription: string;
  tagsText: string;
};

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";
