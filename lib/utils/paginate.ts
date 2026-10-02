export type Page<T> = {
  items: T[];
  /** 1-based, clamped to the pages that exist. */
  page: number;
  pageCount: number;
  /** 1-based index of the first and last item shown; both 0 when empty. */
  from: number;
  to: number;
  total: number;
};

/** One page of `items`; a page past the end shows the last page. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return {
    items: pageItems,
    page: current,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: start + pageItems.length,
    total,
  };
}
