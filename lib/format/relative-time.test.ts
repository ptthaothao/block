import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./relative-time";

const now = Date.parse("2026-09-28T10:00:00Z");
const ago = (ms: number) => new Date(now - ms).toISOString();

describe("formatRelativeTime", () => {
  it("reads naturally in Vietnamese", () => {
    expect(formatRelativeTime(ago(10_000), now)).toBe("vừa xong");
    expect(formatRelativeTime(ago(5 * 60_000), now)).toBe("5 phút trước");
    expect(formatRelativeTime(ago(2 * 3_600_000), now)).toBe("2 giờ trước");
    expect(formatRelativeTime(ago(3 * 86_400_000), now)).toBe("3 ngày trước");
    expect(formatRelativeTime(ago(30 * 86_400_000), now)).toMatch(/2026/);
  });
});
