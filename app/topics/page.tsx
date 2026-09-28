import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { FollowButton } from "@/features/interests/components/follow-button";
import { TagCloud } from "@/features/topics/components/tag-cloud";
import { TopicGrid } from "@/features/topics/components/topic-grid";
import { TopicHero } from "@/features/topics/components/topic-hero";
import { TOPIC_COPY } from "@/features/topics/constants";
import { getTagSummaries, getTopicTree } from "@/features/topics/queries";

export const metadata: Metadata = {
  title: TOPIC_COPY.topicsTitle,
  description: `Tất cả chủ đề và tag trên ${SITE.name}.`,
  alternates: { canonical: ROUTES.topics },
};

export default async function TopicsPage() {
  const [topics, tags] = await Promise.all([getTopicTree(), getTagSummaries()]);
  const postCount = topics.reduce((sum, topic) => sum + topic.postCount, 0);

  return (
    <>
      <TopicHero
        eyebrow={TOPIC_COPY.topicsEyebrow}
        title={TOPIC_COPY.topicsTitle}
        description={TOPIC_COPY.topicsDescription}
        color={null}
        postCount={postCount}
      />
      <Container className="space-y-14 py-12">
        <TopicGrid
          topics={topics}
          renderAction={(topic) => <FollowButton type="category" slug={topic.slug} name={topic.name} color={topic.color} size="sm" />}
        />
        {tags.length > 0 && (
          <section className="space-y-4">
            <Eyebrow>{TOPIC_COPY.tagEyebrow}</Eyebrow>
            <TagCloud tags={tags} label={TOPIC_COPY.tagEyebrow} />
          </section>
        )}
      </Container>
    </>
  );
}
