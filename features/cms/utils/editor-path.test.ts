import { describe, expect, it } from "vitest";

import { isPostEditorPath } from "./editor-path";

describe("isPostEditorPath", () => {
  it("matches the new and edit post pages", () => {
    expect(isPostEditorPath("/cms/posts/new")).toBe(true);
    expect(isPostEditorPath("/cms/posts/8f1c")).toBe(true);
  });

  it("does not match the list or other CMS pages", () => {
    expect(isPostEditorPath("/cms/posts")).toBe(false);
    expect(isPostEditorPath("/cms/posts/")).toBe(false);
    expect(isPostEditorPath("/cms/posts/8f1c/history")).toBe(false);
    expect(isPostEditorPath("/cms/review")).toBe(false);
  });
});
