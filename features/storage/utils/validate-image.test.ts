import { describe, expect, it } from "vitest";

import { STORAGE_ERROR_MESSAGES } from "../constants";
import { matchesAccept, validateImageFile } from "./validate-image";

const png = { name: "a.PNG", type: "image/png", size: 1000 };

describe("matchesAccept", () => {
  it("handles MIME types, wildcards and extensions", () => {
    expect(matchesAccept(png, "image/png")).toBe(true);
    expect(matchesAccept(png, "image/*")).toBe(true);
    expect(matchesAccept(png, ".png, .jpg")).toBe(true);
    expect(matchesAccept(png, "image/jpeg,.webp")).toBe(false);
    expect(matchesAccept(png, "")).toBe(true);
  });
});

describe("validateImageFile", () => {
  const rules = { accept: "image/*", maxSize: 2000 };

  it("passes a valid image", () => {
    expect(validateImageFile(png, rules)).toBeNull();
  });

  it("rejects non-images, unaccepted types and large files", () => {
    expect(validateImageFile({ name: "a.pdf", type: "application/pdf", size: 1 }, rules)).toBe(
      STORAGE_ERROR_MESSAGES.notImage,
    );
    expect(validateImageFile(png, { ...rules, accept: "image/jpeg" })).toBe(STORAGE_ERROR_MESSAGES.typeNotAccepted);
    expect(validateImageFile({ ...png, size: 5000 }, rules)).toBe(STORAGE_ERROR_MESSAGES.tooLarge("2 KB"));
  });
});
