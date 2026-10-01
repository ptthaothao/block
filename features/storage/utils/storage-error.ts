import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";

import { STORAGE_ERROR_MESSAGES } from "../constants";

/** Storage API `statusCode` values we translate (an RLS refusal comes back as 403). */
const STORAGE_STATUS_CODES = { forbidden: "403", notFound: "404" } as const;

/** Turn a Supabase Storage error into a message people can act on. */
export function describeStorageError(error: { statusCode?: string } | null | undefined): string {
  switch (error?.statusCode) {
    case STORAGE_STATUS_CODES.forbidden:
      return COMMON_ERROR_MESSAGES.forbidden;
    case STORAGE_STATUS_CODES.notFound:
      return STORAGE_ERROR_MESSAGES.invalidTarget;
    default:
      return STORAGE_ERROR_MESSAGES.uploadFailed;
  }
}
