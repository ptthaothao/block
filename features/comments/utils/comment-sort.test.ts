import { describe, expect, it } from "vitest";

import { parseCommentSort } from "./comment-sort";

describe("parseCommentSort", () => {
  it("accepts known sorts and falls back to newest", () => {
    expect(parseCommentSort("best")).toBe("best");
    expect(parseCommentSort(["new", "best"])).toBe("new");
    expect(parseCommentSort("hot")).toBe("new");
    expect(parseCommentSort(null)).toBe("new");
  });
});
