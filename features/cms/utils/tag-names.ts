import { slugify } from "@/lib/slug/slugify";

import { TAG_INPUT_SEPARATOR } from "../constants";

export type NormalizedTag = { name: string; slug: string };

/** Trim, drop empties and keep the first spelling of each slug. */
export function normalizeTagNames(names: string[]): NormalizedTag[] {
  const seen = new Set<string>();
  const tags: NormalizedTag[] = [];
  for (const raw of names) {
    const name = raw.trim();
    const slug = slugify(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    tags.push({ name, slug });
  }
  return tags;
}

/** "react, Next.js ,,rls" -> ["react", "Next.js", "rls"] */
export function parseTagInput(value: string): string[] {
  return value
    .split(TAG_INPUT_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Which tag ids to add to and remove from a post. */
export function diffTagIds(current: number[], next: number[]) {
  const currentSet = new Set(current);
  const nextSet = new Set(next);
  return {
    toAdd: next.filter((id) => !currentSet.has(id)),
    toRemove: current.filter((id) => !nextSet.has(id)),
  };
}

/**
 * Add what the author typed to the current tags: split on the separator,
 * skip slugs already there and stop at `max`.
 */
export function addTagNames(current: string[], draft: string, max: number): string[] {
  return normalizeTagNames([...current, ...parseTagInput(draft)])
    .map((tag) => tag.name)
    .slice(0, max);
}
