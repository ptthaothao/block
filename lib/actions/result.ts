import { COMMON_ERROR_MESSAGES } from "./constants";
import type { ActionResult } from "./types";

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(error: string): ActionResult<T> {
  return { ok: false, error };
}

/** First zod issue message, or the generic one. */
export function firstIssue(issues: { message: string }[]): string {
  return issues[0]?.message ?? COMMON_ERROR_MESSAGES.invalid;
}
