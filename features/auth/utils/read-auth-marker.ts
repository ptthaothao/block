import { readCookie } from "@/lib/utils/read-cookie";

import { AUTH_MARKER_COOKIE } from "../constants";

/** The auth marker in this browser (client only); see AUTH_MARKER_COOKIE. */
export function readAuthMarker(): string | null {
  return readCookie(document.cookie, AUTH_MARKER_COOKIE);
}
