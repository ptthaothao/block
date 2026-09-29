import type { Embedded } from "@/lib/supabase/embedded";
import type { Tables } from "@/types/database";

// Shapes of the rows returned by the selects in ./selects.ts.

type PostRow = Tables<"posts">;

export type PostSummaryRow = Pick<
  PostRow,
  "id" | "slug" | "title" | "excerpt" | "cover_url" | "level" | "reading_minutes" | "published_at"
> & {
  category: Embedded<{
    slug: string;
    name: string;
    color: string | null;
    parent: Embedded<{ slug: string; name: string }>;
  }>;
  post_authors: {
    position: number;
    profile: Embedded<{ username: string; display_name: string; avatar_url: string | null }>;
  }[];
  post_tags: { tag: Embedded<{ slug: string; name: string }> }[];
};

export type PostDetailRow = PostSummaryRow &
  Pick<
    PostRow,
    "content_md" | "content_html" | "toc" | "seo_title" | "seo_description" | "updated_at" | "series_position"
  > & {
    series: Embedded<{ slug: string; title: string }>;
  };

