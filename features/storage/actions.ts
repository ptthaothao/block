"use server";

import { authorize } from "@/features/auth/guards";
import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";
import { fail } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/types";

import { STORAGE_ERROR_MESSAGES } from "./constants";
import { objectRefSchema, type ObjectRef } from "./schemas";
import { deleteObject } from "./services/storage-objects";

/** Remove an object uploaded through ImageUpload. Uploads go through the route handler instead (see app/api/storage/images). */
export async function deleteStoredImage(input: ObjectRef): Promise<ActionResult<null>> {
  if (!(await authorize("reader"))) return fail(COMMON_ERROR_MESSAGES.unauthorized);
  const parsed = objectRefSchema.safeParse(input);
  if (!parsed.success) return fail(STORAGE_ERROR_MESSAGES.invalidTarget);
  return deleteObject(parsed.data);
}
