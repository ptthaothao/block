import type { ReactNode } from "react";

import { CardGrid } from "@/components/ui/card-grid";
import { EmptyState } from "@/components/ui/empty-state";

import type { PostSummary } from "../types";
import { PostCard } from "./post-card";

type PostGridProps = {
  posts: PostSummary[];
  emptyTitle?: string;
  emptyHint?: ReactNode;
  columns?: "default" | "withSidebar";
};

export function PostGrid({ posts, emptyTitle = "Chưa có bài viết nào", emptyHint, columns = "default" }: PostGridProps) {
  if (posts.length === 0) return <EmptyState title={emptyTitle}>{emptyHint}</EmptyState>;
  return (
    <CardGrid columns={columns === "withSidebar" ? "withSidebar" : 3}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </CardGrid>
  );
}
