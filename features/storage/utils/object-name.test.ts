import { describe, expect, it } from "vitest";

import { createObjectName, isImageMimeType } from "./object-name";

describe("createObjectName", () => {
  it("uses the id and the extension of the MIME type", () => {
    expect(createObjectName("image/jpeg", "abc")).toBe("abc.jpg");
    expect(createObjectName("image/webp", "abc")).toBe("abc.webp");
  });

  it("generates a different name each time", () => {
    expect(createObjectName("image/png")).not.toBe(createObjectName("image/png"));
  });
});

describe("isImageMimeType", () => {
  it("accepts stored raster types only", () => {
    expect(isImageMimeType("image/png")).toBe(true);
    expect(isImageMimeType("image/svg+xml")).toBe(false);
    expect(isImageMimeType("toString")).toBe(false);
  });
});
