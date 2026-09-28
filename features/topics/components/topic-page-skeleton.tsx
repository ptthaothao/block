import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { PostGridSkeleton } from "@/features/posts/components/post-grid-skeleton";

/** Loading state for topic and tag pages: hero band, chips row and card grid at their real sizes. */
export function TopicPageSkeleton() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="space-y-4 py-12 md:py-16">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-72" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-3.5 w-20" />
        </Container>
      </section>
      <Container className="py-12">
        <PostGridSkeleton />
      </Container>
    </>
  );
}
