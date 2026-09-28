/** sessionStorage key for the action a visitor started before signing in. */
export const PENDING_ACTION_STORAGE_KEY = "codelog:pending-action";

/** A pending action older than this is dropped instead of replayed. */
export const PENDING_ACTION_TTL_MS = 30 * 60_000;
