import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { ActiveFilters } from "@/features/posts/components/filters/active-filters";
import { MobileFilters } from "@/features/posts/components/filters/mobile-filters";
import { PendingNavigationProvider } from "@/features/posts/components/filters/pending-navigation-provider";
import { PendingResults } from "@/features/posts/components/filters/pending-results";
import { PostFilterPanel } from "@/features/posts/components/filters/post-filter-panel";
import { PostsSidebar } from "@/features/posts/components/filters/posts-sidebar";
import { PostGrid } from "@/features/posts/components/post-grid";
import { PostPagination } from "@/features/posts/components/post-pagination";
import { FILTER_COPY, POST_LIMITS } from "@/features/posts/constants";
import { getFilteredPosts } from "@/features/posts/queries";
import { listActiveFilters } from "@/features/posts/utils/active-filters";
import { parsePostFilters } from "@/features/posts/utils/post-filters";
import { getAuthorOptions, getTagSummaries, getTopicTree } from "@/features/topics/queries";

export const metadata: Metadata = {
  title: "Bài viết",
  description: `Tất cả bài viết trên ${SITE.name}, lọc theo chủ đề, tag, tác giả và độ khó.`,
  alternates: { canonical: ROUTES.posts },
};

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const filters = parsePostFilters(await searchParams);
  const [{ items, total }, topics, tags, authors] = await Promise.all([
    getFilteredPosts(filters),
    getTopicTree(),
    getTagSummaries(),
    getAuthorOptions(),
  ]);
  const hasNextPage = (filters.page + 1) * POST_LIMITS.list < total;
  const chips = listActiveFilters(filters, { topics, tags, authors });
  const panel = { basePath: ROUTES.posts, filters, topics, tags, authors };

  return (
    <Container className="py-12 md:py-16">
      <PendingNavigationProvider>
        <div className="flex flex-wrap items-end justify-between gap-x-4">
          <SectionHeading as="h1" eyebrow="Bài viết" title="Tất cả bài viết" />
          <div className="mb-8 flex items-center gap-3">
            <p aria-live="polite" className="font-mono text-xs text-faint">
              {FILTER_COPY.resultCount(total)}
            </p>
            <MobileFilters {...panel} total={total} />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <PostsSidebar>
            <PostFilterPanel {...panel} />
          </PostsSidebar>

          <div className="min-w-0">
            <ActiveFilters basePath={ROUTES.posts} chips={chips} />
            <PendingResults>
              <PostGrid
                posts={items}
                columns="withSidebar"
                emptyTitle={chips.length > 0 ? FILTER_COPY.emptyTitle : undefined}
                emptyHint={
                  chips.length > 0 && (
                    <div className="space-y-4">
                      <p>{FILTER_COPY.emptyHint}</p>
                      <ButtonLink href={ROUTES.posts} variant="outline" size="sm">
                        {FILTER_COPY.clear}
                      </ButtonLink>
                    </div>
                  )
                }
              />
            </PendingResults>
            <PostPagination basePath={ROUTES.posts} filters={filters} hasNextPage={hasNextPage} />
          </div>
        </div>
      </PendingNavigationProvider>
    </Container>
  );
}
