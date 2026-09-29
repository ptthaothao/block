import { ButtonLink } from "@/components/ui/button";

import type { PostFilters } from "../types";
import { buildFilterHref, filterChanges } from "../utils/post-filters";

type PostPaginationProps = { basePath: string; filters: PostFilters; hasNextPage: boolean };

export function PostPagination({ basePath, filters, hasNextPage }: PostPaginationProps) {
  const { page } = filters;
  if (page === 0 && !hasNextPage) return null;
  const hrefFor = (target: number) => buildFilterHref(basePath, filterChanges.page(filters, target));

  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-between gap-3">
      {page > 0 ? (
        <ButtonLink href={hrefFor(page - 1)} variant="outline" size="sm" rel="prev" className="min-h-11">
          Trang trước
        </ButtonLink>
      ) : (
        <span />
      )}
      <span className="font-mono text-xs text-faint">Trang {page + 1}</span>
      {hasNextPage ? (
        <ButtonLink href={hrefFor(page + 1)} variant="outline" size="sm" rel="next" className="min-h-11">
          Trang sau
        </ButtonLink>
      ) : (
        <span />
      )}
    </nav>
  );
}
