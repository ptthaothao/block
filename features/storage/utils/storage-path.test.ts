import { describe, expect, it } from "vitest";

import { joinObjectPath, normalizeStoragePath } from "./storage-path";

describe("normalizeStoragePath", () => {
  it("trims slashes and keeps nested folders", () => {
    expect(normalizeStoragePath("cover")).toBe("cover");
    expect(normalizeStoragePath("/content/post-123/")).toBe("content/post-123");
    expect(normalizeStoragePath("")).toBe("");
  });

  it("rejects traversal, empty segments, odd characters and deep nesting", () => {
    expect(normalizeStoragePath("../secret")).toBeNull();
    expect(normalizeStoragePath("a//b")).toBeNull();
    expect(normalizeStoragePath("a b")).toBeNull();
    expect(normalizeStoragePath("a/b/c/d/e")).toBeNull();
  });
});

describe("joinObjectPath", () => {
  it("joins a folder and an object name", () => {
    expect(joinObjectPath("cover", "a.webp")).toBe("cover/a.webp");
    expect(joinObjectPath("", "a.webp")).toBe("a.webp");
  });
});
