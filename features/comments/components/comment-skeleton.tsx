import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COMMENTS = 3;

/** Three grey comments with the same outline as the real ones. */
export function CommentSkeleton() {
  return (
    <ul aria-hidden className="space-y-6">
      {Array.from({ length: SKELETON_COMMENTS }, (_, i) => (
        <li key={i} className="flex gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
