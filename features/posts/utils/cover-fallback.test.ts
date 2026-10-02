import { describe, expect, it } from "vitest";

import { coverFallbackBackground } from "./cover-fallback";

describe("coverFallbackBackground", () => {
  it("tints with a valid hex colour", () => {
    expect(coverFallbackBackground("#38bdf8")).toContain("color-mix(in srgb, #38bdf8 38%");
  });

  it("falls back to the accent colour for missing or unsafe input", () => {
    expect(coverFallbackBackground(null)).toContain("var(--accent)");
    expect(coverFallbackBackground("red);x:url(y")).not.toContain("url(");
  });
});
