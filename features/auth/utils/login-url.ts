import { QUERY_PARAMS, ROUTES } from "@/config/routes";

import type { LoginErrorCode } from "../constants";
import { OTP_SENT_FLAG } from "../constants";

type LoginUrlOptions = { next?: string; error?: LoginErrorCode; sent?: boolean; email?: string };

/** Relative /login URL with its query string. */
export function buildLoginPath({ next, error, sent, email }: LoginUrlOptions = {}): string {
  const params = new URLSearchParams();
  if (error) params.set(QUERY_PARAMS.error, error);
  if (sent) params.set(QUERY_PARAMS.sent, OTP_SENT_FLAG);
  if (email) params.set(QUERY_PARAMS.email, email);
  if (next) params.set(QUERY_PARAMS.next, next);
  const query = params.toString();
  return query ? `${ROUTES.login}?${query}` : ROUTES.login;
}

/** Absolute auth callback URL that Supabase redirects back to (GitHub OAuth only). */
export function buildCallbackUrl(origin: string, next: string): string {
  const url = new URL(ROUTES.authCallback, origin);
  url.searchParams.set(QUERY_PARAMS.next, next);
  return url.toString();
}
