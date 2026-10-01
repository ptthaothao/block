import "server-only";

import { fail, ok } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/types";
import { createClient } from "@/lib/supabase/server";

import { STORAGE_CACHE_CONTROL_SECONDS, STORAGE_ERROR_MESSAGES, type ImageMimeType } from "../constants";
import type { ObjectRef } from "../schemas";
import type { StorageTarget, StoredImage } from "../types";
import { createObjectName } from "../utils/object-name";
import { describeStorageError } from "../utils/storage-error";
import { joinObjectPath } from "../utils/storage-path";

type ImageFile = { file: File; type: ImageMimeType };

/**
 * Store one image under `<bucket>/<path>/<uuid>.<ext>` as the signed-in user,
 * so Storage RLS on `storage.objects` decides who may write where.
 */
export async function uploadImageObject(target: StorageTarget, { file, type }: ImageFile): Promise<ActionResult<StoredImage>> {
  const objectPath = joinObjectPath(target.path, createObjectName(type));
  const storage = (await createClient()).storage.from(target.bucket);

  const { error } = await storage.upload(objectPath, file, {
    contentType: type,
    cacheControl: STORAGE_CACHE_CONTROL_SECONDS,
    upsert: false,
  });
  if (error) return fail(describeStorageError(error));

  const { data } = storage.getPublicUrl(objectPath);
  return ok({
    id: objectPath,
    bucket: target.bucket,
    path: objectPath,
    url: data.publicUrl,
    name: file.name,
    size: file.size,
  });
}

/** Delete one object; RLS limits this to objects the user owns (or editors). */
export async function deleteObject({ bucket, path }: ObjectRef): Promise<ActionResult<null>> {
  const { data, error } = await (await createClient()).storage.from(bucket).remove([path]);
  // Storage answers a refused (RLS) or missing object with an empty list, not an error.
  return !error && data.length > 0 ? ok(null) : fail(STORAGE_ERROR_MESSAGES.deleteFailed);
}
