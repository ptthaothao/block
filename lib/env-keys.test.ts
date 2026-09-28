import { describe, expect, it } from "vitest";

import { DEFAULT_SITE_URL, ENV_KEYS, resolveSiteUrl } from "./env-keys";

describe("resolveSiteUrl", () => {
  it("prefers SITE_URL", () => {
    const env = { [ENV_KEYS.siteUrl]: "https://codelog.dev", [ENV_KEYS.vercelProductionUrl]: "x.vercel.app" };
    expect(resolveSiteUrl(env)).toBe("https://codelog.dev");
  });

  it("falls back to the Vercel production domain", () => {
    expect(resolveSiteUrl({ [ENV_KEYS.vercelProductionUrl]: "block-puce-one.vercel.app" })).toBe(
      "https://block-puce-one.vercel.app",
    );
  });

  it("uses localhost when nothing is set", () => {
    expect(resolveSiteUrl({})).toBe(DEFAULT_SITE_URL);
  });
});
