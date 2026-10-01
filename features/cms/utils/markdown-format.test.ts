import { describe, expect, it } from "vitest";

import { applyMarkdownFormat } from "./markdown-format";

const BOLD = { kind: "wrap", before: "**", after: "**", placeholder: "chữ đậm" } as const;
const H2 = { kind: "line", prefix: "## " } as const;
const QUOTE = { kind: "line", prefix: "> " } as const;
const RULE = { kind: "block", snippet: "---\n" } as const;

describe("applyMarkdownFormat", () => {
  it("wraps the selection and keeps it selected", () => {
    expect(applyMarkdownFormat("a word b", 2, 6, BOLD)).toEqual({
      text: "a **word** b",
      selectionStart: 4,
      selectionEnd: 8,
    });
  });

  it("wraps a placeholder when nothing is selected", () => {
    expect(applyMarkdownFormat("", 0, 0, BOLD)).toEqual({ text: "**chữ đậm**", selectionStart: 2, selectionEnd: 9 });
  });

  it("prefixes every line the selection touches", () => {
    expect(applyMarkdownFormat("one\ntwo\nthree", 1, 5, QUOTE).text).toBe("> one\n> two\nthree");
  });

  it("removes the prefix when every line already has it", () => {
    expect(applyMarkdownFormat("> one\n> two", 0, 0, QUOTE).text).toBe("one\n> two");
    expect(applyMarkdownFormat("> one\n> two", 0, 11, QUOTE).text).toBe("one\ntwo");
  });

  it("replaces an existing heading level", () => {
    expect(applyMarkdownFormat("# Title", 3, 3, H2).text).toBe("## Title");
  });

  it("starts a block on its own line", () => {
    expect(applyMarkdownFormat("text", 4, 4, RULE)).toEqual({ text: "text\n---\n", selectionStart: 9, selectionEnd: 9 });
    expect(applyMarkdownFormat("", 0, 0, RULE).text).toBe("---\n");
  });
});
