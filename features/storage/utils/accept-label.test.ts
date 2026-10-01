import { describe, expect, it } from "vitest";

import { describeAccept } from "./accept-label";

describe("describeAccept", () => {
  it("lists formats once, skipping wildcards", () => {
    expect(describeAccept("image/png,image/jpeg,.jpg,.webp")).toBe("PNG, JPG, WEBP");
    expect(describeAccept("image/*")).toBe("");
  });
});
