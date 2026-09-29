import { RELATIVE_TIME_MAX_DAYS } from "./constants";
import { formatDate } from "./date";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** "vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước", then the date. */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const elapsed = Math.max(0, now - new Date(iso).getTime());
  if (elapsed < MINUTE_MS) return "vừa xong";
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)} phút trước`;
  if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)} giờ trước`;
  if (elapsed < RELATIVE_TIME_MAX_DAYS * DAY_MS) return `${Math.floor(elapsed / DAY_MS)} ngày trước`;
  return formatDate(iso);
}
