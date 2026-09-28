import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { QUERY_PARAMS, ROUTES } from "@/config/routes";
import { PostGrid } from "@/features/posts/components/post-grid";
import { PostPagination } from "@/features/posts/components/post-pagination";
import { EMPTY_POST_FILTERS, POST_LIMITS } from "@/features/posts/constants";
import { getFilteredPosts } from "@/features/posts/queries";
import { parsePage } from "@/features/posts/utils/post-filters";
import { TopicHero } from "@/features/topics/components/topic-hero";
import { TOPIC_COPY, TOPIC_LIMITS } from "@/features/topics/constants";
import { buildTagMetadata } from "@/features/topics/metadata";
import { getTagSummaries, getTagSummary } from "@/features/topics/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const tags = await getTagSummaries();
  return tags.slice(0, TOPIC_LIMITS.staticParams).map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tags/[slug]">): Promise<Metadata> {
  const tag = await getTagSummary((await params).slug);
  return tag ? buildTagMetadata(tag) : {};
}

export default async function TagPage({ params, searchParams }: PageProps<"/tags/[slug]">) {
  const { slug } = await params;
  const tag = await getTagSummary(slug);
  if (!tag) notFound();

  const pageFilters = { ...EMPTY_POST_FILTERS, page: parsePage((await searchParams)[QUERY_PARAMS.page]) };
  const { items, total } = await getFilteredPosts({ ...pageFilters, tags: [tag.slug] });

  return (
    <>
      <TopicHero eyebrow={TOPIC_COPY.tagEyebrow} title={`#${tag.name}`} description={null} color={null} postCount={tag.postCount} />
      <Container className="py-12">
        <PostGrid posts={items} emptyTitle={TOPIC_COPY.emptyTagPosts} />
        <PostPagination
          basePath={ROUTES.tag(tag.slug)}
          filters={pageFilters}
          hasNextPage={(pageFilters.page + 1) * POST_LIMITS.list < total}
        />
      </Container>
    </>
  );
}
