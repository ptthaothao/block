import { EMAIL_RATE_LIMIT_ERROR_CODES, LOGIN_ERROR_CODES, type LoginErrorCode } from "../constants";

/** Login error to show when Supabase refuses to send a magic link. */
export function sendErrorCode(supabaseCode: string | undefined): LoginErrorCode {
  return supabaseCode && EMAIL_RATE_LIMIT_ERROR_CODES.includes(supabaseCode)
    ? LOGIN_ERROR_CODES.rateLimited
    : LOGIN_ERROR_CODES.send;
}
