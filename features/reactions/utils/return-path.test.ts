import { describe, expect, it } from "vitest";

import { reactionReturnPath } from "./return-path";

describe("reactionReturnPath", () => {
  it("returns to the reactions on the post", () => {
    expect(reactionReturnPath("queue")).toBe("/posts/queue#reactions");
  });
});
