import { describe, expect, it } from "vitest";

import { buildCallbackUrl, buildLoginPath } from "./login-url";

describe("buildLoginPath", () => {
  it("returns the bare path without options", () => {
    expect(buildLoginPath()).toBe("/login");
  });

  it("encodes error, sent, email and next", () => {
    expect(buildLoginPath({ error: "email", next: "/me?tab=1" })).toBe("/login?error=email&next=%2Fme%3Ftab%3D1");
    expect(buildLoginPath({ sent: true, email: "a@b.com" })).toBe("/login?sent=1&email=a%40b.com");
  });
});

describe("buildCallbackUrl", () => {
  it("points at the auth callback with next", () => {
    expect(buildCallbackUrl("https://codelog.dev", "/cms")).toBe(
      "https://codelog.dev/auth/callback?next=%2Fcms",
    );
  });
});
