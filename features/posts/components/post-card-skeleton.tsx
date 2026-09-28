import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Same outline as PostCard (without a cover), so the grid doesn't jump when posts arrive. */
export function PostCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-11/12" />
      <Skeleton className="h-6 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3.5 w-32" />
      </div>
    </Card>
  );
}
