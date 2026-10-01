import { describe, expect, it } from "vitest";

import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";

import { STORAGE_ERROR_MESSAGES } from "../constants";
import { describeStorageError } from "./storage-error";

describe("describeStorageError", () => {
  it("maps RLS refusals and missing buckets", () => {
    expect(describeStorageError({ statusCode: "403" })).toBe(COMMON_ERROR_MESSAGES.forbidden);
    expect(describeStorageError({ statusCode: "404" })).toBe(STORAGE_ERROR_MESSAGES.invalidTarget);
    expect(describeStorageError({ statusCode: "500" })).toBe(STORAGE_ERROR_MESSAGES.uploadFailed);
    expect(describeStorageError(null)).toBe(STORAGE_ERROR_MESSAGES.uploadFailed);
  });
});
