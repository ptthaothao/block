import { CALLBACK_EXPIRED_ERROR_CODES, LOGIN_ERROR_CODES, type LoginErrorCode } from "../constants";

/** Login error to show when the OAuth/magic-link callback fails to exchange its code. */
export function callbackErrorCode(supabaseCode: string | undefined): LoginErrorCode {
  return supabaseCode && CALLBACK_EXPIRED_ERROR_CODES.includes(supabaseCode)
    ? LOGIN_ERROR_CODES.callbackExpired
    : LOGIN_ERROR_CODES.callback;
}
