export const HTTP_STATUS = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  tooManyRequests: 429,
} as const;

/** Responses about the current user must never be cached by a CDN or the browser. */
export const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;
