import type { InterestItem } from "../types";

export type InterestGroups = {
  categories: InterestItem[];
  tags: InterestItem[];
  authors: InterestItem[];
  muted: InterestItem[];
};

/** Split interests into the sections of "Quan tâm của tôi"; every mute goes to "Đã ẩn". */
export function groupInterests(items: InterestItem[]): InterestGroups {
  const follows = items.filter((item) => item.weight === 1);
  return {
    categories: follows.filter((item) => item.type === "category"),
    tags: follows.filter((item) => item.type === "tag"),
    authors: follows.filter((item) => item.type === "author"),
    muted: items.filter((item) => item.weight === -1),
  };
}
