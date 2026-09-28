import { QUERY_PARAMS } from "@/config/routes";

import { LOGIN_ERROR_MESSAGES, OTP_SENT_FLAG, type LoginErrorCode } from "../constants";

type SearchParams = Record<string, string | string[] | undefined>;

function isLoginErrorCode(value: unknown): value is LoginErrorCode {
  return typeof value === "string" && value in LOGIN_ERROR_MESSAGES;
}

function asString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** What the login page should show, read from its query string. */
export function readLoginStatus(params: SearchParams) {
  const error = params[QUERY_PARAMS.error];
  const sent = params[QUERY_PARAMS.sent] === OTP_SENT_FLAG;
  const email = asString(params[QUERY_PARAMS.email]);
  return {
    errorMessage: isLoginErrorCode(error) ? LOGIN_ERROR_MESSAGES[error] : undefined,
    sent: sent && Boolean(email),
    email,
  };
}
