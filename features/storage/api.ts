import { API_ROUTES } from "@/config/routes";

import { IMAGE_UPLOAD_FIELDS, STORAGE_ERROR_MESSAGES } from "./constants";
import type { StorageTarget, StoredImage } from "./types";

/** Browser-side writes to our own API (BFF): the browser never calls Supabase. */
export const storageApi = {
  /** Upload one image; throws a message people can act on. */
  async uploadImage(file: File, { bucket, path }: StorageTarget): Promise<StoredImage> {
    const body = new FormData();
    body.set(IMAGE_UPLOAD_FIELDS.file, file);
    body.set(IMAGE_UPLOAD_FIELDS.bucket, bucket);
    body.set(IMAGE_UPLOAD_FIELDS.path, path);

    let res: Response;
    try {
      res = await fetch(API_ROUTES.storageImages, { method: "POST", body, credentials: "same-origin" });
    } catch {
      throw new Error(STORAGE_ERROR_MESSAGES.network);
    }
    if (!res.ok) {
      const error = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(error?.error ?? STORAGE_ERROR_MESSAGES.uploadFailed);
    }
    return res.json() as Promise<StoredImage>;
  },
};
