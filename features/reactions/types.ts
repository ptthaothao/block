import type { Enums } from "@/types/database";

export type ReactionKind = Enums<"reaction_kind">;

/** How many readers left each emoji; emoji nobody picked are absent. */
export type ReactionCounts = Partial<Record<ReactionKind, number>>;

/** What a reaction widget needs: counts plus the current reader's picks. */
export type ReactionState = { counts: ReactionCounts; mine: ReactionKind[] };

/** Reactions on a post, as /api/posts/[slug]/reactions returns them. */
export type PostReactions = ReactionState & { commentCount: number };

/** What is being reacted to. Posts are addressed by slug, comments by id. */
export type ReactionTarget = { type: "post"; slug: string } | { type: "comment"; id: string };

export type ReactionToggle = { target: ReactionTarget; emoji: ReactionKind };

/** A few names for the hover tooltip, plus how many reacted in total. */
export type ReactionPeople = { names: string[]; total: number };

/** Where a tooltip lazily loads the names of people who left an emoji. */
export type PeopleSource = { queryKey: readonly unknown[]; fetch: () => Promise<ReactionPeople> };
