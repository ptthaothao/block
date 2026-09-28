"use server";

import { authorize } from "@/features/auth/guards";
import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";
import { fail, firstIssue, ok } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/types";
import { createClient } from "@/lib/supabase/server";

import { interestChangeSchema, interestItemsSchema } from "./schemas";
import type { InterestChange, InterestItem } from "./types";

type Result = ActionResult<null>;

/** Follow (1), mute (-1) or clear (0) one topic, tag or author. */
export async function setInterest(change: InterestChange): Promise<Result> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = interestChangeSchema.safeParse(change);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_interest", {
    p_type: parsed.data.type,
    p_slug: parsed.data.slug,
    p_weight: parsed.data.weight,
  });
  return error ? fail(COMMON_ERROR_MESSAGES.unknown) : ok(null);
}

/** Save interests picked before signing in. Unknown or no-longer-valid targets are skipped. */
export async function importInterests(items: InterestItem[]): Promise<ActionResult<{ saved: number }>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = interestItemsSchema.safeParse(items);
  if (!parsed.success) return fail(firstIssue(parsed.error.issues));

  const supabase = await createClient();
  const results = await Promise.all(
    parsed.data.map((item) =>
      supabase.rpc("set_interest", { p_type: item.type, p_slug: item.slug, p_weight: item.weight }),
    ),
  );
  return ok({ saved: results.filter((result) => !result.error).length });
}

/** "Đặt lại gợi ý": forget every follow and mute. */
export async function resetInterests(): Promise<Result> {
  const user = await authorize("reader");
  if (!user) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const supabase = await createClient();
  const { error } = await supabase.from("user_interests").delete().eq("user_id", user.id);
  return error ? fail(COMMON_ERROR_MESSAGES.unknown) : ok(null);
}
