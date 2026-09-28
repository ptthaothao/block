import "server-only";

import { unstable_cache } from "next/cache";

import { POST_REVALIDATE_SECONDS } from "@/features/posts/constants";
import { createClient } from "@/lib/supabase/server";
import { getPublicClient } from "@/lib/supabase/public";

import { FOLLOWER_CACHE, INTEREST_CACHE_TAGS } from "./constants";
import { toInterestItem } from "./mappers";
import type { InterestRow } from "./rows";
import { INTEREST_SELECT } from "./selects";
import type { InterestItem, InterestType } from "./types";

/** The signed-in user's interests (RLS returns only their own rows). */
export async function getMyInterests(): Promise<InterestItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_interests")
    .select(INTEREST_SELECT)
    .order("created_at")
    .overrideTypes<InterestRow[], { merge: false }>();
  if (error) throw new Error(`getMyInterests: ${error.message}`);
  return data.flatMap((row) => toInterestItem(row) ?? []);
}

export async function countMyInterests(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase.from("user_interests").select("id", { count: "exact", head: true });
  if (error) throw new Error(`countMyInterests: ${error.message}`);
  return count ?? 0;
}

/** Public follower count for a topic/tag/author page. Cached; a little staleness is fine for a count. */
export function getFollowerCount(type: InterestType, slug: string): Promise<number> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient();
      if (!supabase) return 0;
      const { data, error } = await supabase.rpc("follower_count", { p_type: type, p_slug: slug });
      if (error) throw new Error(`getFollowerCount: ${error.message}`);
      return data ?? 0;
    },
    [FOLLOWER_CACHE.key, type, slug],
    { tags: [INTEREST_CACHE_TAGS.followers], revalidate: Math.min(FOLLOWER_CACHE.revalidateSeconds, POST_REVALIDATE_SECONDS) },
  )();
}
