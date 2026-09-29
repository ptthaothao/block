import { PENDING_ACTION_STORAGE_KEY } from "./constants";
import { matchesPendingAction, parsePendingAction, serializePendingAction } from "./pending-action";
import type { PendingAction } from "./types";

// Browser-only. Storage may be blocked; then the action is simply not resumed.

export function savePendingAction<TPayload>(action: Omit<PendingAction<TPayload>, "createdAt">) {
  try {
    window.sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, serializePendingAction({ ...action, createdAt: Date.now() }));
  } catch {
    // Storage blocked.
  }
}

/** Remove and return the stored action if it belongs to this widget; leaves other actions alone. */
export function takePendingAction<TPayload>(type: string, postSlug: string): PendingAction<TPayload> | null {
  try {
    const action = parsePendingAction(window.sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY));
    if (!matchesPendingAction(action, type, postSlug)) return null;
    window.sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
    return action as PendingAction<TPayload>;
  } catch {
    return null;
  }
}
