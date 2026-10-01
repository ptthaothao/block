import { describe, expect, it } from "vitest";

import { mentionPrefix } from "./composer-text";

describe("composer text helpers", () => {
  it("prefills a mention once", () => {
    expect(mentionPrefix("bob", "")).toBe("@bob ");
    expect(mentionPrefix("bob", "@bob hi")).toBe("@bob hi");
  });
});
