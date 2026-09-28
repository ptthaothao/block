import { EMAIL_RATE_LIMIT_ERROR_CODE, LOGIN_ERROR_CODES, type LoginErrorCode } from "../constants";

/** Login page error for a failed magic-link send, from the Supabase Auth error code. */
export function emailSendErrorCode(authErrorCode: string | undefined): LoginErrorCode {
  return authErrorCode === EMAIL_RATE_LIMIT_ERROR_CODE ? LOGIN_ERROR_CODES.rateLimit : LOGIN_ERROR_CODES.send;
}
