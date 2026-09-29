import type { Database, Tables } from "@/types/database";

type Functions = Database["public"]["Functions"];

export type TopicRow = Pick<Tables<"categories">, "id" | "parent_id" | "slug" | "name" | "description" | "icon" | "color">;

export type TopicCountRow = Functions["category_post_counts"]["Returns"][number];

export type TagRow = Pick<Tables<"tags">, "id" | "slug" | "name">;

export type TagCountRow = Functions["tag_post_counts"]["Returns"][number];

export type AuthorCountRow = Functions["author_post_counts"]["Returns"][number];
