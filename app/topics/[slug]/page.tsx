import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { QUERY_PARAMS, ROUTES } from "@/config/routes";
import { PostGrid } from "@/features/posts/components/post-grid";
import { PostPagination } from "@/features/posts/components/post-pagination";
import { EMPTY_POST_FILTERS, POST_LIMITS } from "@/features/posts/constants";
import { getFilteredPosts } from "@/features/posts/queries";
import { parsePage } from "@/features/posts/utils/post-filters";
import { SubtopicChips } from "@/features/topics/components/subtopic-chips";
import { TopicHero } from "@/features/topics/components/topic-hero";
import { TOPIC_COPY, TOPIC_LIMITS } from "@/features/topics/constants";
import { buildTopicMetadata } from "@/features/topics/metadata";
import { getTopicPage, getTopicTree } from "@/features/topics/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const tree = await getTopicTree();
  return tree
    .flatMap((topic) => [topic.slug, ...topic.children.map((child) => child.slug)])
    .slice(0, TOPIC_LIMITS.staticParams)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const topic = await getTopicPage((await params).slug);
  return topic ? buildTopicMetadata(topic) : {};
}

export default async function TopicPage({ params, searchParams }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = await getTopicPage(slug);
  if (!topic) notFound();

  // Pagination links stay on this page, so the topic itself is not in the query string.
  const pageFilters = { ...EMPTY_POST_FILTERS, page: parsePage((await searchParams)[QUERY_PARAMS.page]) };
  const { items, total } = await getFilteredPosts({ ...pageFilters, topic: topic.slug });

  return (
    <>
      <TopicHero
        eyebrow={topic.parent ? topic.name : TOPIC_COPY.topicsTitle}
        title={topic.name}
        description={topic.description}
        icon={topic.icon}
        color={topic.color}
        postCount={topic.postCount}
        parent={topic.parent}
      >
        <SubtopicChips root={topic.root} current={topic.slug} />
      </TopicHero>
      <Container className="py-12">
        <PostGrid posts={items} emptyTitle={TOPIC_COPY.emptyTopicPosts} />
        <PostPagination
          basePath={ROUTES.topic(topic.slug)}
          filters={pageFilters}
          hasNextPage={(pageFilters.page + 1) * POST_LIMITS.list < total}
        />
      </Container>
    </>
  );
}
