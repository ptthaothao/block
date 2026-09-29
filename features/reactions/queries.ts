import "server-only";

import { PUBLISHED_STATUS } from "@/features/posts/constants";
import { unwrapEmbedded } from "@/lib/supabase/embedded";
import { createClient } from "@/lib/supabase/server";

import { REACTION_LIMITS } from "./constants";
import { toReactionCounts, toReactionKinds } from "./mappers";
import type { PostStatsRow, ReactionPersonRow } from "./rows";
import { POST_STATS_SELECT, REACTION_PERSON_SELECT } from "./selects";
import type { PostReactions, ReactionKind, ReactionPeople, ReactionTarget } from "./types";

type Client = Awaited<ReturnType<typeof createClient>>;

/** The database id behind a target, or null when it doesn't exist or isn't published. */
export async function resolveTargetId(supabase: Client, target: ReactionTarget): Promise<string | null> {
  if (target.type === "comment") return target.id;
  const { data } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", target.slug)
    .eq("status", PUBLISHED_STATUS)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Counts for a post plus the current reader's own picks. Read through the
 * reader's session (not cached): counts change all the time and `mine` is personal.
 */
export async function getPostReactions(slug: string): Promise<PostReactions | null> {
  const supabase = await createClient();
  const postId = await resolveTargetId(supabase, { type: "post", slug });
  if (!postId) return null;

  const [stats, mine] = await Promise.all([
    supabase.from("post_stats").select(POST_STATS_SELECT).eq("post_id", postId).maybeSingle<PostStatsRow>(),
    supabase.rpc("my_reactions", { p_target_type: "post", p_target_ids: [postId] }),
  ]);
  if (stats.error) throw new Error(`getPostReactions: ${stats.error.message}`);
  if (mine.error) throw new Error(`getPostReactions: ${mine.error.message}`);

  return {
    counts: toReactionCounts(stats.data?.reaction_counts),
    mine: toReactionKinds(mine.data.map((row) => row.emoji)),
    commentCount: stats.data?.comment_count ?? 0,
  };
}

/** The most recent few people who left an emoji, for the tooltip. */
export async function getReactionPeople(target: ReactionTarget, emoji: ReactionKind): Promise<ReactionPeople | null> {
  const supabase = await createClient();
  const targetId = await resolveTargetId(supabase, target);
  if (!targetId) return null;

  const { data, count, error } = await supabase
    .from("reactions")
    .select(REACTION_PERSON_SELECT, { count: "exact" })
    .eq("target_type", target.type)
    .eq("target_id", targetId)
    .eq("emoji", emoji)
    .order("created_at", { ascending: false })
    .limit(REACTION_LIMITS.peopleNames)
    .overrideTypes<ReactionPersonRow[], { merge: false }>();
  if (error) throw new Error(`getReactionPeople: ${error.message}`);

  return {
    names: data.flatMap((row) => unwrapEmbedded(row.profile)?.display_name ?? []),
    total: count ?? data.length,
  };
}
