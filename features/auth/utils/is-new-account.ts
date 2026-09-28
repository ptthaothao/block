import { NEW_ACCOUNT_WINDOW_MS } from "../constants";

/** True when the account was created within NEW_ACCOUNT_WINDOW_MS of `now`. */
export function isNewAccount(createdAt: Date | null, now: Date = new Date()): boolean {
  return createdAt !== null && now.getTime() - createdAt.getTime() <= NEW_ACCOUNT_WINDOW_MS;
}
