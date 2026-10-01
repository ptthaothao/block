import { authorize } from "@/features/auth/guards";
import { IMAGE_MAX_BYTES, IMAGE_UPLOAD_FIELDS, STORAGE_ERROR_MESSAGES } from "@/features/storage/constants";
import { bucketSchema, storagePathSchema } from "@/features/storage/schemas";
import { uploadImageObject } from "@/features/storage/services/storage-objects";
import { isImageMimeType } from "@/features/storage/utils/object-name";
import { formatFileSize } from "@/lib/format/file-size";
import { badGateway, badRequest, jsonNoStore, unauthorized } from "@/lib/http/api-response";

/**
 * Upload one image to Supabase Storage (BFF: the browser never talks to
 * Supabase). A route rather than a Server Action so several files can upload
 * in parallel. Who may write to which bucket/path is decided by Storage RLS.
 */
export async function POST(request: Request) {
  if (!(await authorize("reader"))) return unauthorized();

  const form = await request.formData().catch(() => null);
  const file = form?.get(IMAGE_UPLOAD_FIELDS.file);
  if (!(file instanceof File)) return badRequest();
  if (!isImageMimeType(file.type)) return badRequest(STORAGE_ERROR_MESSAGES.typeNotAccepted);
  if (file.size > IMAGE_MAX_BYTES) return badRequest(STORAGE_ERROR_MESSAGES.tooLarge(formatFileSize(IMAGE_MAX_BYTES)));

  const bucket = bucketSchema.safeParse(form?.get(IMAGE_UPLOAD_FIELDS.bucket));
  const path = storagePathSchema.safeParse(form?.get(IMAGE_UPLOAD_FIELDS.path) ?? "");
  if (!bucket.success || !path.success) return badRequest(STORAGE_ERROR_MESSAGES.invalidTarget);

  const result = await uploadImageObject({ bucket: bucket.data, path: path.data }, { file, type: file.type });
  if (!result.ok) return badGateway(result.error);
  return jsonNoStore(result.data);
}
