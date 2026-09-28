import { PG_ERROR_CODES } from "@/lib/actions/constants";

import { CMS_ERROR_MESSAGES } from "../constants";

type DbError = { code?: string; message: string } | null | undefined;

/** Turn a Postgres/PostgREST error into a message people can act on. */
export function describeDbError(error: DbError): string {
  switch (error?.code) {
    case PG_ERROR_CODES.uniqueViolation:
      return CMS_ERROR_MESSAGES.duplicateSlug;
    case PG_ERROR_CODES.foreignKeyViolation:
      return CMS_ERROR_MESSAGES.inUse;
    case PG_ERROR_CODES.insufficientPrivilege:
      return CMS_ERROR_MESSAGES.forbidden;
    case PG_ERROR_CODES.checkViolation:
      return CMS_ERROR_MESSAGES.invalid;
    default:
      return CMS_ERROR_MESSAGES.unknown;
  }
}
