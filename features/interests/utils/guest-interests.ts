import { GUEST_INTERESTS_STORAGE } from "../constants";
import { interestItemsSchema } from "../schemas";
import type { InterestItem } from "../types";

type StoredInterests = { v: number; items: InterestItem[] };

/** Parse what localStorage holds; anything unreadable or from another version counts as empty. */
export function parseGuestInterests(raw: string | null): InterestItem[] {
  if (!raw) return [];
  try {
    const stored = JSON.parse(raw) as Partial<StoredInterests>;
    if (stored.v !== GUEST_INTERESTS_STORAGE.version) return [];
    const parsed = interestItemsSchema.safeParse(stored.items);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function serializeGuestInterests(items: InterestItem[]): string {
  const stored: StoredInterests = { v: GUEST_INTERESTS_STORAGE.version, items };
  return JSON.stringify(stored);
}
