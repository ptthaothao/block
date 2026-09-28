import { describe, expect, it } from "vitest";

import { LOGIN_ERROR_CODES } from "../constants";
import { callbackErrorCode } from "./callback-error-code";

describe("callbackErrorCode", () => {
  it.each(["bad_code_verifier", "otp_expired"])("maps %s to callback_expired", (code) => {
    expect(callbackErrorCode(code)).toBe(LOGIN_ERROR_CODES.callbackExpired);
  });

  it.each(["unexpected_failure", undefined])("falls back to callback for %s", (code) => {
    expect(callbackErrorCode(code)).toBe(LOGIN_ERROR_CODES.callback);
  });
});
