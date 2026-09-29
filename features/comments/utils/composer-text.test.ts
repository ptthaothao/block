import { describe, expect, it } from "vitest";

import { applyComposerTool, mentionPrefix } from "./composer-text";

describe("composer text helpers", () => {
  it("wraps the selection and keeps it selected", () => {
    expect(applyComposerTool({ value: "xin chào", start: 4, end: 8 }, "bold")).toEqual({ value: "xin **chào**", start: 6, end: 10 });
  });

  it("inserts a placeholder when nothing is selected", () => {
    const result = applyComposerTool({ value: "", start: 0, end: 0 }, "code");
    expect(result.value).toBe("`code`");
    expect(result.value.slice(result.start, result.end)).toBe("code");
  });

  it("prefills a mention once", () => {
    expect(mentionPrefix("bob", "")).toBe("@bob ");
    expect(mentionPrefix("bob", "@bob hi")).toBe("@bob hi");
  });
});
