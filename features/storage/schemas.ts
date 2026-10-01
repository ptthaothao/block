import { z } from "zod";

import { STORAGE_SEGMENT_PATTERN } from "./constants";
import { normalizeStoragePath } from "./utils/storage-path";

export const bucketSchema = z.string().regex(STORAGE_SEGMENT_PATTERN);

/** Folder path under a bucket; normalised so `/cover/` and `cover` are the same. */
export const storagePathSchema = z
  .string()
  .transform((value, ctx) => {
    const path = normalizeStoragePath(value);
    if (path === null) ctx.addIssue({ code: "custom", message: "invalid path" });
    return path ?? "";
  });

/** A full object path, e.g. `content/<postId>/<uuid>.webp`, as the delete action takes it. */
export const objectRefSchema = z.object({
  bucket: bucketSchema,
  path: z
    .string()
    .min(1)
    .refine((value) => !value.split("/").some((part) => part === "" || part === "." || part === "..")),
});

export type ObjectRef = z.infer<typeof objectRefSchema>;
