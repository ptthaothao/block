import type { TocItem } from "@/lib/markdown/types";
import type { Enums } from "@/types/database";

// DTOs: the only post shapes that leave the server. Internal columns
// (review_note, created_by, search, ...) never reach a page.

export type PostLevel = Enums<"post_level">;

export type CategoryRef = {
  slug: string;
  name: string;
  color: string | null;
  parent: { slug: string; name: string } | null;
};

export type AuthorRef = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type TagRef = { slug: string; name: string };

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  level: PostLevel;
  readingMinutes: number;
  publishedAt: string | null;
  category: CategoryRef | null;
  authors: AuthorRef[];
  tags: TagRef[];
};

export type PostDetail = PostSummary & {
  html: string;
  toc: TocItem[];
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
  series: { slug: string; title: string; position: number | null } | null;
};

/** Filters for post lists, read from and written to the URL. `page` is zero-based. */
export type PostFilters = {
  topic: string | null;
  tags: string[];
  levels: PostLevel[];
  author: string | null;
  page: number;
};
