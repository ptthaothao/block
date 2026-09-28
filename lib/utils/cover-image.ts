// Must match the remotePattern in next.config.ts. Cover URLs are validated
// against this same pattern when saved (features/cms/schemas.ts), but older
// rows written before that check existed (or written directly in the
// database) can still hold a URL from an unconfigured host, which crashes
// next/image at render time instead of just failing to load. Checking here
// lets pages fall back to no cover instead of a runtime error.
const SUPABASE_STORAGE_URL_PATTERN = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//;

/** Whether `next/image` can render this URL, per next.config.ts's remotePatterns. */
export function isAllowedCoverUrl(url: string | null): url is string {
  return url !== null && SUPABASE_STORAGE_URL_PATTERN.test(url);
}
