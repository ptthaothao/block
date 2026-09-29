import { QUERY_PARAMS, ROUTES } from "@/config/routes";

import type { LoginErrorCode } from "../constants";
import { OTP_SENT_FLAG } from "../constants";

type StatusUrlOptions = { next?: string; error?: LoginErrorCode; sent?: boolean; email?: string };

function buildStatusPath(base: string, { next, error, sent, email }: StatusUrlOptions): string {
  const params = new URLSearchParams();
  if (error) params.set(QUERY_PARAMS.error, error);
  if (sent) params.set(QUERY_PARAMS.sent, OTP_SENT_FLAG);
  if (email) params.set(QUERY_PARAMS.email, email);
  if (next) params.set(QUERY_PARAMS.next, next);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** Relative /login URL with its query string. */
export function buildLoginPath(options: StatusUrlOptions = {}): string {
  return buildStatusPath(ROUTES.login, options);
}

/** Relative /set-password URL with its query string. */
export function buildSetPasswordPath(next: string, error?: LoginErrorCode): string {
  return buildStatusPath(ROUTES.setPassword, { next, error });
}

/** Relative /forgot-password URL with its query string. */
export function buildForgotPasswordPath(options: StatusUrlOptions = {}): string {
  return buildStatusPath(ROUTES.forgotPassword, options);
}

/** Absolute auth callback URL that Supabase redirects back to (GitHub OAuth, and email links: registration, password reset). */
export function buildCallbackUrl(origin: string, next: string): string {
  const url = new URL(ROUTES.authCallback, origin);
  url.searchParams.set(QUERY_PARAMS.next, next);
  return url.toString();
}
