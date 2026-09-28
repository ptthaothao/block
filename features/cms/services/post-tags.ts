import "server-only";

import type { SessionUser } from "@/features/auth/types";
import { hasRole } from "@/features/auth/utils/roles";
import { unwrapEmbedded } from "@/lib/supabase/embedded";
import type { createClient } from "@/lib/supabase/server";

import { diffTagIds, normalizeTagNames } from "../utils/tag-names";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/**
 * Make a post's tags match `names`. Unknown tags are created: approved when an
 * editor adds them, pending (hidden from readers) when an author does.
 *
 * Checks the post's current tag slugs first and returns early when they
 * already match `names`, which is the common case on autosave (most saves
 * don't touch the tags field) — this avoids 3-4 round-trips per save.
 */
export async function syncPostTags(supabase: Supabase, user: SessionUser, postId: string, names: string[]) {
  const wanted = normalizeTagNames(names);
  const slugs = wanted.map((t) => t.slug);

  const { data: current, error: currentError } = await supabase
    .from("post_tags")
    .select("tag_id, tag:tags(slug)")
    .eq("post_id", postId);
  if (currentError) return currentError;

  const currentSlugs = current.flatMap((row) => unwrapEmbedded(row.tag)?.slug ?? []);
  if (sameSlugs(currentSlugs, slugs)) return null;

  const known = await resolveTagIds(supabase, user, wanted);
  if (!(known instanceof Map)) return known;

  const nextIds = slugs.flatMap((slug) => known.get(slug) ?? []);
  const { toAdd, toRemove } = diffTagIds(
    current.map((row) => row.tag_id),
    nextIds,
  );

  if (toRemove.length) {
    const { error } = await supabase.from("post_tags").delete().eq("post_id", postId).in("tag_id", toRemove);
    if (error) return error;
  }
  if (toAdd.length) {
    const { error } = await supabase.from("post_tags").insert(toAdd.map((tagId) => ({ post_id: postId, tag_id: tagId })));
    if (error) return error;
  }
  return null;
}

/** Look up tag ids for `wanted`, creating any that don't exist yet. */
async function resolveTagIds(supabase: Supabase, user: SessionUser, wanted: { name: string; slug: string }[]) {
  const slugs = wanted.map((t) => t.slug);
  const { data: existing, error: findError } = slugs.length
    ? await supabase.from("tags").select("id, slug").in("slug", slugs)
    : { data: [], error: null };
  if (findError) return findError;

  const known = new Map((existing ?? []).map((t) => [t.slug, t.id]));
  const missing = wanted.filter((t) => !known.has(t.slug));
  if (!missing.length) return known;

  const status = hasRole(user.role, "editor") ? "approved" : "pending";
  const { data: created, error } = await supabase
    .from("tags")
    .insert(missing.map((t) => ({ name: t.name, slug: t.slug, status, created_by: user.id })))
    .select("id, slug");
  if (error) return error;
  for (const t of created) known.set(t.slug, t.id);
  return known;
}

function sameSlugs(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x.localeCompare(y));
  const sortedB = [...b].sort((x, y) => x.localeCompare(y));
  return sortedA.every((slug, i) => slug === sortedB[i]);
}
