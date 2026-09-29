import { describe, expect, it } from "vitest";

import { CMS_ERROR_MESSAGES } from "../constants";
import { describeDbError } from "./action-error";

describe("describeDbError", () => {
  it("maps known Postgres codes", () => {
    expect(describeDbError({ code: "23505", message: "dup" })).toBe(CMS_ERROR_MESSAGES.duplicateSlug);
    expect(describeDbError({ code: "42501", message: "rls" })).toBe(CMS_ERROR_MESSAGES.forbidden);
  });

  it("falls back to a generic message", () => {
    expect(describeDbError({ code: "XX000", message: "boom" })).toBe(CMS_ERROR_MESSAGES.unknown);
  });
});
