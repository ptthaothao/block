export const CMS_POST_LIST_SELECT = `
  id, title, slug, status, updated_at, published_at, review_note,
  category:category_id ( name ),
  creator:created_by ( display_name )
` as const;

/** Same as the list, but only posts the given profile co-authors (inner join). */
export const CMS_MY_POST_LIST_SELECT = `${CMS_POST_LIST_SELECT}, post_authors!inner ( profile_id )` as const;

export const CMS_POST_SELECT = `
  id, title, slug, excerpt, content_md, status, level, category_id, series_id, series_position,
  cover_url, seo_title, seo_description, review_note, updated_at,
  post_authors ( profile_id ),
  post_tags ( tag:tags ( name ) )
` as const;

export const CMS_SAVED_POST_SELECT = "id, slug, status, updated_at" as const;

export const CMS_CATEGORY_SELECT = "id, parent_id, name, slug, description, icon, color, position, posts ( count )" as const;

export const CMS_TAG_SELECT = "id, name, slug, status, post_tags ( count )" as const;

export const CMS_SERIES_SELECT = "id, title, slug, description, cover_url, posts ( count )" as const;
