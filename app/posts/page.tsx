import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SITE } from "@/config/site";
import { QUERY_PARAMS } from "@/config/routes";
import { SectionHeading } from "@/components/ui/section-heading";
import { PostGrid } from "@/features/posts/components/post-grid";
import { PostPagination } from "@/features/posts/components/post-pagination";
import { POST_LIMITS } from "@/features/posts/constants";
import { getPostsPage } from "@/features/posts/queries";

export const metadata: Metadata = {
  title: "Bài viết",
  description: `Tất cả bài viết mới nhất trên ${SITE.name}.`,
};

function parsePage(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 1 ? n - 1 : 0;
}

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const page = parsePage((await searchParams)[QUERY_PARAMS.page]);
  const { items, total } = await getPostsPage(page);
  const hasNextPage = (page + 1) * POST_LIMITS.list < total;

  return (
    <Container className="py-16">
      <SectionHeading as="h1" eyebrow="Bài viết" title="Mới nhất" />
      <PostGrid posts={items} />
      <PostPagination page={page} hasNextPage={hasNextPage} />
    </Container>
  );
}
