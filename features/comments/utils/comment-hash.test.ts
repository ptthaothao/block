import { describe, expect, it } from "vitest";

import { parseCommentHash } from "./comment-hash";

describe("parseCommentHash", () => {
  it("recognises the section and single comments", () => {
    expect(parseCommentHash("#comments")).toEqual({ wantsComments: true, commentId: null });
    expect(parseCommentHash("#comment-abc")).toEqual({ wantsComments: true, commentId: "abc" });
    expect(parseCommentHash("#retry")).toEqual({ wantsComments: false, commentId: null });
    expect(parseCommentHash("")).toEqual({ wantsComments: false, commentId: null });
  });
});
