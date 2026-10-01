import { describe, expect, it } from "vitest";

import { formatFileSize } from "./file-size";

describe("formatFileSize", () => {
  it("picks a unit and rounds to one decimal", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2 KB");
    expect(formatFileSize(62_976)).toBe("61.5 KB");
    expect(formatFileSize(4 * 1024 * 1024)).toBe("4 MB");
  });
});
