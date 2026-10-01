import { describe, expect, it } from "vitest";

import { activeHref } from "./active-href";

const HREFS = ["/cms/posts", "/cms/posts/new", "/cms/review"];

describe("activeHref", () => {
  it("matches the exact path", () => {
    expect(activeHref("/cms/review", HREFS)).toBe("/cms/review");
  });

  it("prefers the longest matching href", () => {
    expect(activeHref("/cms/posts/new", HREFS)).toBe("/cms/posts/new");
  });

  it("lights up the parent for a nested page", () => {
    expect(activeHref("/cms/posts/8f2c", HREFS)).toBe("/cms/posts");
  });

  it("does not match on a shared prefix that is not a segment", () => {
    expect(activeHref("/cms/reviewers", HREFS)).toBeNull();
  });

  it("returns null when nothing matches", () => {
    expect(activeHref("/cms", HREFS)).toBeNull();
  });
});
