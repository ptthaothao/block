import { CardGrid } from "@/components/ui/card-grid";

import { POST_SKELETON_COUNT } from "../constants";
import { PostCardSkeleton } from "./post-card-skeleton";

export function PostGridSkeleton({ count = POST_SKELETON_COUNT, columns = "default" }: { count?: number; columns?: "default" | "withSidebar" }) {
  return (
    <CardGrid columns={columns === "withSidebar" ? "withSidebar" : "posts"}>
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </CardGrid>
  );
}
