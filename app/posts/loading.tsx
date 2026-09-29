import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { PostGridSkeleton } from "@/features/posts/components/post-grid-skeleton";
import { FILTER_SKELETON_ROWS } from "@/features/posts/constants";

export default function PostsLoading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="mb-16 space-y-3">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: FILTER_SKELETON_ROWS }, (_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
        <PostGridSkeleton columns="withSidebar" />
      </div>
    </Container>
  );
}
