import { describe, expect, it } from "vitest";

import { parseCommentSort } from "./comment-sort";

describe("parseCommentSort", () => {
  it("accepts known sorts and falls back to best", () => {
    expect(parseCommentSort("new")).toBe("new");
    expect(parseCommentSort(["best", "new"])).toBe("best");
    expect(parseCommentSort("hot")).toBe("best");
    expect(parseCommentSort(null)).toBe("best");
  });
});
