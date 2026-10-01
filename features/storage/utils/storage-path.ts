import { STORAGE_PATH_MAX_DEPTH, STORAGE_SEGMENT_PATTERN } from "../constants";

/**
 * Folder path under a bucket, trimmed of surrounding slashes. Returns null
 * when any segment is empty, `.`/`..` or has characters outside
 * STORAGE_SEGMENT_PATTERN, or when it is nested too deep. An empty string is
 * valid and means the bucket root.
 */
export function normalizeStoragePath(path: string): string | null {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, "");
  if (trimmed === "") return "";
  const segments = trimmed.split("/");
  if (segments.length > STORAGE_PATH_MAX_DEPTH) return null;
  return segments.every((segment) => STORAGE_SEGMENT_PATTERN.test(segment)) ? segments.join("/") : null;
}

/** `cover` + `a.webp` -> `cover/a.webp`; an empty folder means the bucket root. */
export function joinObjectPath(folder: string, objectName: string): string {
  return folder ? `${folder}/${objectName}` : objectName;
}
