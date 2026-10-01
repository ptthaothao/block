import { describe, expect, it } from "vitest";

import { addTagNames, diffTagIds, normalizeTagNames, parseTagInput } from "./tag-names";

describe("tag helpers", () => {
  it("parses comma separated input", () => {
    expect(parseTagInput("react, Next.js ,,rls")).toEqual(["react", "Next.js", "rls"]);
  });

  it("dedupes by slug", () => {
    expect(normalizeTagNames(["Next.js", "next-js", " ", "Bảo mật"])).toEqual([
      { name: "Next.js", slug: "next-js" },
      { name: "Bảo mật", slug: "bao-mat" },
    ]);
  });

  it("diffs tag ids", () => {
    expect(diffTagIds([1, 2, 3], [2, 4])).toEqual({ toAdd: [4], toRemove: [1, 3] });
  });

  it("adds typed tags without duplicates, up to the limit", () => {
    expect(addTagNames(["react"], "React, nextjs, rls", 3)).toEqual(["react", "nextjs", "rls"]);
    expect(addTagNames(["a", "b"], "c, d", 3)).toEqual(["a", "b", "c"]);
  });
});
