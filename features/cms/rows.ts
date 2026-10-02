import type { Embedded } from "@/lib/supabase/embedded";
import type { Tables } from "@/types/database";

type PostRow = Tables<"posts">;

export type CmsPostListRow = Pick<
  PostRow,
  "id" | "title" | "slug" | "status" | "updated_at" | "published_at" | "review_note"
> & {
  category: Embedded<{ name: string }>;
  creator: Embedded<{ display_name: string }>;
};

export type CmsPostRow = Pick<
  PostRow,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "content_md"
  | "status"
  | "level"
  | "category_id"
  | "series_id"
  | "series_position"
  | "cover_url"
  | "seo_title"
  | "seo_description"
  | "review_note"
  | "updated_at"
> & {
  post_authors: { profile_id: string }[];
  post_tags: { tag: Embedded<{ name: string }> }[];
};

export type CmsSavedPostRow = Pick<PostRow, "id" | "slug" | "status" | "updated_at">;

export type CmsCategoryRow = Pick<
  Tables<"categories">,
  "id" | "parent_id" | "name" | "slug" | "description" | "icon" | "color" | "position"
> & {
  posts: { count: number }[];
};

export type CmsTagRow = Pick<Tables<"tags">, "id" | "name" | "slug" | "status"> & {
  post_tags: { count: number }[];
};

export type CmsSeriesRow = Pick<Tables<"series">, "id" | "title" | "slug" | "description" | "cover_url"> & {
  posts: { count: number }[];
};
