/** Value of one cookie from a `document.cookie`-style string, or null when it is not set. */
export function readCookie(cookieString: string, name: string): string | null {
  for (const pair of cookieString.split(";")) {
    const separator = pair.indexOf("=");
    if (separator === -1) continue;
    if (pair.slice(0, separator).trim() === name) return decodeURIComponent(pair.slice(separator + 1).trim());
  }
  return null;
}
