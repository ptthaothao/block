import { unwrapEmbedded } from "@/lib/supabase/embedded";

import type { InterestRow } from "./rows";
import type { InterestItem } from "./types";

export function toInterestItem(row: InterestRow): InterestItem | null {
  const weight = row.weight === -1 ? -1 : 1;
  const category = unwrapEmbedded(row.category);
  if (category) return { type: "category", slug: category.slug, name: category.name, weight, color: category.color, avatarUrl: null };
  const tag = unwrapEmbedded(row.tag);
  if (tag) return { type: "tag", slug: tag.slug, name: tag.name, weight, color: null, avatarUrl: null };
  const author = unwrapEmbedded(row.author);
  if (author) {
    return { type: "author", slug: author.username, name: author.display_name, weight, color: null, avatarUrl: author.avatar_url };
  }
  return null;
}
