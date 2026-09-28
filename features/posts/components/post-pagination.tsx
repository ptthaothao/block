import { ButtonLink } from "@/components/ui/button";
import { QUERY_PARAMS, ROUTES } from "@/config/routes";

type PostPaginationProps = { page: number; hasNextPage: boolean };

function pageHref(page: number) {
  return page === 0 ? ROUTES.posts : `${ROUTES.posts}?${QUERY_PARAMS.page}=${page + 1}`;
}

export function PostPagination({ page, hasNextPage }: PostPaginationProps) {
  if (page === 0 && !hasNextPage) return null;

  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-between gap-3">
      {page > 0 ? (
        <ButtonLink href={pageHref(page - 1)} variant="outline" size="sm">
          Trang trước
        </ButtonLink>
      ) : (
        <span />
      )}
      {hasNextPage && (
        <ButtonLink href={pageHref(page + 1)} variant="outline" size="sm">
          Trang sau
        </ButtonLink>
      )}
    </nav>
  );
}
