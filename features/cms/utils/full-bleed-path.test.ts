import { describe, expect, it } from "vitest";

import { isFullBleedPath } from "./full-bleed-path";

describe("isFullBleedPath", () => {
  it("matches the post editor and the review workspace", () => {
    expect(isFullBleedPath("/cms/posts/new")).toBe(true);
    expect(isFullBleedPath("/cms/posts/8f1c")).toBe(true);
    expect(isFullBleedPath("/cms/review")).toBe(true);
  });

  it("does not match other CMS pages", () => {
    expect(isFullBleedPath("/cms")).toBe(false);
    expect(isFullBleedPath("/cms/posts")).toBe(false);
    expect(isFullBleedPath("/cms/taxonomy")).toBe(false);
  });
});
