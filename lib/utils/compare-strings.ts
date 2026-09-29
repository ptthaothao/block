/**
 * Code-point order, the same as a bare `.sort()` but explicit. Used where a
 * list of slugs or keys must have one canonical order (URLs, query keys),
 * so it must not depend on the runtime's locale.
 */
export function compareStrings(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
