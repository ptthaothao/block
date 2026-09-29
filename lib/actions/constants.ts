/** Messages shared by every feature's actions and API routes. */
export const COMMON_ERROR_MESSAGES = {
  unauthorized: "Bạn cần đăng nhập để làm việc này.",
  forbidden: "Bạn không có quyền làm việc này.",
  notFound: "Không tìm thấy nội dung này.",
  invalid: "Dữ liệu chưa hợp lệ.",
  rateLimited: "Bạn thao tác hơi nhanh, đợi một chút rồi thử lại nhé.",
  unknown: "Có lỗi xảy ra, thử lại sau nhé.",
} as const;

/** Postgres error codes we translate for people. */
export const PG_ERROR_CODES = {
  uniqueViolation: "23505",
  foreignKeyViolation: "23503",
  insufficientPrivilege: "42501",
  checkViolation: "23514",
  /** Raised by our own RPCs when the target does not exist or is not open. */
  noDataFound: "P0002",
  /** Raised by our own RPCs when a rate limit is hit. */
  rateLimited: "P0429",
} as const;
