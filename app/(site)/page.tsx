import { HomeHero } from "@/features/home/components/home-hero";
import { LatestPostsSection } from "@/features/home/components/latest-posts-section";
import { TopicsSection } from "@/features/home/components/topics-section";
import { POST_LIMITS } from "@/features/posts/constants";
import { getLatestPosts } from "@/features/posts/queries";
import { TOPIC_LIMITS } from "@/features/topics/constants";
import { getTagSummaries, getTopicTree } from "@/features/topics/queries";

export default async function HomePage() {
  const [posts, topics, tags] = await Promise.all([getLatestPosts(POST_LIMITS.home), getTopicTree(), getTagSummaries()]);

  return (
    <>
      <HomeHero />
      <LatestPostsSection posts={posts} />
      <TopicsSection topics={topics} tags={tags.slice(0, TOPIC_LIMITS.homeTags)} />
    </>
  );
}
