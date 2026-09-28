import type { Json } from "@/types/database";

export type PostStatsRow = { reaction_counts: Json; comment_count: number };

export type ReactionPersonRow = { profile: { display_name: string } | { display_name: string }[] | null };
