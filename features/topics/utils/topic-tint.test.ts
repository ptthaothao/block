import { describe, expect, it } from "vitest";

import { topicTint } from "./topic-tint";

describe("topicTint", () => {
  it("turns a hex colour into a translucent rgb()", () => {
    expect(topicTint("#38bdf8", 0.5)).toBe("rgb(56 189 248 / 0.5)");
  });

  it("rejects anything that is not #rrggbb", () => {
    expect(topicTint(null)).toBeNull();
    expect(topicTint("red")).toBeNull();
    expect(topicTint("#fff")).toBeNull();
  });
});
