// PostgREST select strings. Self-referencing categories use column hints
// (category_id, parent_id); fkey-name hints are ambiguous there.

export const POST_SUMMARY_SELECT = `
  id, slug, title, excerpt, cover_url, level, reading_minutes, published_at,
  category:category_id (
    slug, name, color,
    parent:parent_id ( slug, name )
  ),
  post_authors ( position, profile:profiles ( username, display_name, avatar_url ) ),
  post_tags ( tag:tags ( slug, name ) )
` as const;

export const POST_DETAIL_SELECT = `${POST_SUMMARY_SELECT},
  content_md, content_html, toc, seo_title, seo_description, updated_at,
  series_position, series ( slug, title )
` as const;

export const POST_SLUG_SELECT = "slug" as const;
