import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Same outline as PostCard, so the grid doesn't jump when posts arrive. */
export function PostCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <Skeleton className="aspect-video w-full rounded-b-none" />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
