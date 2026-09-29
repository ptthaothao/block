// author_id and user_id both reference profiles, so the author embed uses a column hint.
export const INTEREST_SELECT = `
  weight,
  category:category_id ( slug, name, color ),
  tag:tag_id ( slug, name ),
  author:author_id ( username, display_name, avatar_url )
` as const;
