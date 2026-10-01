function matches(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The nav href the current page belongs to: the longest one that is the path
 * or a parent of it, so /cms/posts/123 lights up /cms/posts while
 * /cms/posts/new lights up its own entry.
 */
export function activeHref(pathname: string, hrefs: readonly string[]): string | null {
  return hrefs.filter((href) => matches(pathname, href)).reduce<string | null>(
    (best, href) => (best === null || href.length > best.length ? href : best),
    null,
  );
}
