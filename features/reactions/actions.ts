"use server";

import { authorize } from "@/features/auth/guards";
import { COMMON_ERROR_MESSAGES, PG_ERROR_CODES } from "@/lib/actions/constants";
import { fail, firstIssue, ok } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/types";
import { createClient } from "@/lib/supabase/server";

import { toReactionCounts, toReactionKinds } from "./mappers";
import { resolveTargetId } from "./queries";
import { reactionToggleSchema } from "./schemas";
import type { ReactionState, ReactionToggle } from "./types";

/** Add or remove one emoji. Returns the fresh counts so the widget can reconcile. The page is not revalidated. */
export async function toggleReaction(input: ReactionToggle): Promise<ActionResult<ReactionState>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = reactionToggleSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const targetId = await resolveTargetId(supabase, parsed.data.target);
  if (!targetId) return fail(COMMON_ERROR_MESSAGES.notFound);

  const { data, error } = await supabase
    .rpc("toggle_reaction", { p_target_type: parsed.data.target.type, p_target_id: targetId, p_emoji: parsed.data.emoji })
    .single();
  if (error) {
    if (error.code === PG_ERROR_CODES.rateLimited) return fail(COMMON_ERROR_MESSAGES.rateLimited);
    if (error.code === PG_ERROR_CODES.noDataFound) return fail(COMMON_ERROR_MESSAGES.notFound);
    return fail(COMMON_ERROR_MESSAGES.unknown);
  }
  return ok({ counts: toReactionCounts(data.counts), mine: toReactionKinds(data.mine) });
}
