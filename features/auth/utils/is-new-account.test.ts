import { describe, expect, it } from "vitest";

import { NEW_ACCOUNT_WINDOW_MS } from "../constants";
import { isNewAccount } from "./is-new-account";

describe("isNewAccount", () => {
  const now = new Date("2026-09-28T10:00:00Z");

  it("is true inside the window and false outside it", () => {
    expect(isNewAccount(new Date(now.getTime() - NEW_ACCOUNT_WINDOW_MS + 1), now)).toBe(true);
    expect(isNewAccount(new Date(now.getTime() - NEW_ACCOUNT_WINDOW_MS - 1), now)).toBe(false);
    expect(isNewAccount(null, now)).toBe(false);
  });
});
