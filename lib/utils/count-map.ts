import type { Json } from "@/types/database";

/** Read a {"key": count} JSON object, keeping only the given keys with positive whole counts. */
export function toCountMap<K extends string>(value: Json | null | undefined, keys: readonly K[]): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return counts;
  for (const key of keys) {
    const n = value[key];
    if (typeof n === "number" && Number.isInteger(n) && n > 0) counts[key] = n;
  }
  return counts;
}

/** Keep only values that are one of `keys`. */
export function pickKnown<K extends string>(values: readonly string[] | null | undefined, keys: readonly K[]): K[] {
  return (values ?? []).filter((v): v is K => (keys as readonly string[]).includes(v));
}
