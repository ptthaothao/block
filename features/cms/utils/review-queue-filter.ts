import type { CmsPostListItem } from "../types";

/** Lowercase without Vietnamese diacritics, so "toi uu" finds "Tối ưu". */
function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

/** Posts whose title, author or category contains `query`. */
export function filterReviewQueue(posts: CmsPostListItem[], query: string): CmsPostListItem[] {
  const needle = fold(query.trim());
  if (!needle) return posts;
  return posts.filter((post) =>
    [post.title, post.authorName, post.categoryName].some((field) => field && fold(field).includes(needle)),
  );
}
