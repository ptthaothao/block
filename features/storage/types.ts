/**
 * An image that lives in Supabase Storage. This is the ImageUpload `value`:
 * only images that already exist on the server, so a parent can save the
 * list as-is (e.g. `url` into a `cover_url` column, or `bucket` + `path`).
 */
export type StoredImage = {
  /** Stable key; the object path is unique within a bucket. */
  id: string;
  bucket: string;
  /** Full object path inside the bucket, e.g. `cover/<uuid>.webp`. */
  path: string;
  /** Public URL, renderable by next/image. */
  url: string;
  /** Original file name, for display only. */
  name: string;
  /** Bytes, when known (unknown for images loaded from a saved URL). */
  size: number | null;
};

/** Where to put new objects. Neither part carries business meaning here. */
export type StorageTarget = { bucket: string; path: string };

/** A file picked in this session that is not (yet) a StoredImage. */
export type PendingImage = {
  /** Local id, never sent anywhere. */
  key: string;
  file: File;
  /** Object URL for the local preview; revoked when the item goes away. */
  previewUrl: string;
  status: "uploading" | "error";
  error: string | null;
};

/** Whether the removed image was uploaded in this session (and already deleted) or came from `value`. */
export type RemovedImageOrigin = "session" | "existing";
