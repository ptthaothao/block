import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { ROUTES, TOPICS_SECTION_ID } from "@/config/routes";
import { TagCloud } from "@/features/topics/components/tag-cloud";
import { TopicGrid } from "@/features/topics/components/topic-grid";
import { TOPIC_COPY } from "@/features/topics/constants";
import type { TagSummary, TopicSummary } from "@/features/topics/types";

export function TopicsSection({ topics, tags }: { topics: TopicSummary[]; tags: TagSummary[] }) {
  return (
    <section id={TOPICS_SECTION_ID} className="scroll-mt-20 border-y border-border bg-surface-sunken">
      <Container className="space-y-8 py-16">
        <SectionHeading
          eyebrow={TOPIC_COPY.topicsEyebrow}
          title={TOPIC_COPY.topicsTitle}
          action={
            <TextLink href={ROUTES.topics} tone="accent" className="text-sm font-medium">
              Xem tất cả →
            </TextLink>
          }
        />
        <TopicGrid topics={topics} />
        <TagCloud tags={tags} label={TOPIC_COPY.tagEyebrow} />
      </Container>
    </section>
  );
}
