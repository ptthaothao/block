import { PENDING_ACTION_TTL_MS } from "./constants";
import type { PendingAction } from "./types";

export function serializePendingAction(action: PendingAction): string {
  return JSON.stringify(action);
}

/** Parse a stored action; null when missing, malformed or older than the TTL. */
export function parsePendingAction(raw: string | null, now: number = Date.now()): PendingAction | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<PendingAction>;
    if (typeof value.type !== "string" || typeof value.postSlug !== "string" || typeof value.createdAt !== "number") {
      return null;
    }
    if (now - value.createdAt > PENDING_ACTION_TTL_MS || value.createdAt > now) return null;
    return { type: value.type, postSlug: value.postSlug, payload: value.payload, createdAt: value.createdAt };
  } catch {
    return null;
  }
}

/** Whether a stored action is the one this widget should replay. */
export function matchesPendingAction(action: PendingAction | null, type: string, postSlug: string): action is PendingAction {
  return action !== null && action.type === type && action.postSlug === postSlug;
}
