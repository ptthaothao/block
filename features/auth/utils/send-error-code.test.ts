import { describe, expect, it } from "vitest";

import { LOGIN_ERROR_CODES } from "../constants";
import { sendErrorCode } from "./send-error-code";

describe("sendErrorCode", () => {
  it.each(["over_email_send_rate_limit", "over_request_rate_limit"])("maps %s to rate limited", (code) => {
    expect(sendErrorCode(code)).toBe(LOGIN_ERROR_CODES.rateLimited);
  });

  it.each(["unexpected_failure", undefined])("falls back to send for %s", (code) => {
    expect(sendErrorCode(code)).toBe(LOGIN_ERROR_CODES.send);
  });
});
