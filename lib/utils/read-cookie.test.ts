import { describe, expect, it } from "vitest";

import { readCookie } from "./read-cookie";

describe("readCookie", () => {
  it("finds a cookie among others", () => {
    expect(readCookie("a=1; auth-marker=abc; b=2", "auth-marker")).toBe("abc");
  });

  it("does not match a cookie whose name only ends with the one asked for", () => {
    expect(readCookie("x-auth-marker=abc", "auth-marker")).toBeNull();
  });

  it("decodes the value", () => {
    expect(readCookie("name=a%20b", "name")).toBe("a b");
  });

  it("returns null when absent or empty", () => {
    expect(readCookie("a=1", "b")).toBeNull();
    expect(readCookie("", "b")).toBeNull();
  });
});
