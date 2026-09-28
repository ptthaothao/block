import { describe, expect, it } from "vitest";

import { EMAIL_RATE_LIMIT_ERROR_CODE, LOGIN_ERROR_CODES } from "../constants";
import { emailSendErrorCode } from "./email-send-error";

describe("emailSendErrorCode", () => {
  it("maps the Supabase rate limit to its own message", () => {
    expect(emailSendErrorCode(EMAIL_RATE_LIMIT_ERROR_CODE)).toBe(LOGIN_ERROR_CODES.rateLimit);
  });

  it("falls back to the generic send error", () => {
    expect(emailSendErrorCode("unexpected_failure")).toBe(LOGIN_ERROR_CODES.send);
    expect(emailSendErrorCode(undefined)).toBe(LOGIN_ERROR_CODES.send);
  });
});
