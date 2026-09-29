import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { ROUTES } from "@/config/routes";
import { HomeFeed } from "@/features/interests/components/home-feed";
import { PostGrid } from "@/features/posts/components/post-grid";
import type { PostSummary } from "@/features/posts/types";

export function LatestPostsSection({ posts }: { posts: PostSummary[] }) {
  return (
    <Container as="section" className="py-16">
      <SectionHeading
        eyebrow="Mới ra lò"
        title="Bài viết"
        action={
          <TextLink href={ROUTES.posts} tone="accent" className="text-sm font-medium">
            Xem tất cả →
          </TextLink>
        }
      />
      <HomeFeed latest={<PostGrid posts={posts} emptyHint="Bài đầu tiên sẽ sớm xuất hiện ở đây." />} />
    </Container>
  );
}
