import {
  Briefcase,
  Container,
  Database,
  Hash,
  LayoutTemplate,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/** unstable_cache key prefixes. */
export const TOPIC_CACHE_KEYS = {
  tree: "topics:tree",
  tags: "topics:tags",
  authors: "topics:authors",
} as const;

export const TOPIC_LIMITS = {
  /** Tags shown in a filter group before "Xem tất cả". */
  filterTagsCollapsed: 8,
  /** Authors shown in a filter group before "Xem tất cả". */
  filterAuthorsCollapsed: 5,
  /** Popular tag chips under the topic grid on the home page. */
  homeTags: 12,
  /** Topic/tag pages pre-rendered at build. */
  staticParams: 100,
} as const;

/** Category `icon` values (set in the CMS) mapped to icons; unknown names fall back to a hash. */
export const TOPIC_ICONS: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  server: Server,
  smartphone: Smartphone,
  container: Container,
  database: Database,
  sparkles: Sparkles,
  shield: Shield,
  briefcase: Briefcase,
};

export const FALLBACK_TOPIC_ICON = Hash;

export const TOPIC_COPY = {
  postCount: (n: number) => `${n} bài`,
  allSubtopics: "Tất cả",
  topicsEyebrow: "Chọn món",
  topicsTitle: "Chủ đề",
  topicsDescription: "Chọn một mảng để đọc sâu, hoặc bấm Quan tâm để trang chủ hợp gu bạn hơn.",
  tagEyebrow: "Tag",
  emptyTopics: "Chưa có chủ đề",
  emptyTopicPosts: "Chủ đề này chưa có bài nào. Tác giả đang gõ phím, quay lại sau nhé.",
  emptyTagPosts: "Chưa có bài nào gắn tag này.",
} as const;

/** Opacity of a topic's colour when used as a background tint. */
export const TOPIC_TINT_ALPHA = {
  surface: 0.12,
  glow: 0.22,
  border: 0.4,
} as const;
