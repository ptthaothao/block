import { describe, expect, it } from "vitest";

import { COMMON_ERROR_MESSAGES } from "./constants";
import { fail, firstIssue, ok } from "./result";

describe("action results", () => {
  it("wraps data and errors", () => {
    expect(ok(1)).toEqual({ ok: true, data: 1 });
    expect(fail("x")).toEqual({ ok: false, error: "x" });
  });

  it("uses the first issue or the generic message", () => {
    expect(firstIssue([{ message: "a" }, { message: "b" }])).toBe("a");
    expect(firstIssue([])).toBe(COMMON_ERROR_MESSAGES.invalid);
  });
});
