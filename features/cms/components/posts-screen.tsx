"use client";

import { useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { hasRole } from "@/features/auth/utils/roles";

import { useCmsPosts } from "../hooks/use-cms-queries";
import { useCmsUser } from "../hooks/use-cms-user";
import type { PostStatus } from "../types";
import { PageHeader } from "./page-header";
import { PostsTable } from "./posts-table";
import { QueryState } from "./query-state";
import { StatusFilter } from "./status-filter";

export function PostsScreen() {
  const { role } = useCmsUser();
  const [status, setStatus] = useState<PostStatus | null>(null);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useCmsPosts(status);
  const isEditor = hasRole(role, "editor");
  const posts = data?.pages.flatMap((page) => page.items);

  return (
    <>
      <PageHeader
        title={isEditor ? "Tất cả bài viết" : "Bài của tôi"}
        actions={<ButtonLink href={ROUTES.cmsNewPost}>Viết bài mới</ButtonLink>}
      />
      <StatusFilter value={status} onChange={setStatus} />
      <div className="mt-6">
        <QueryState isLoading={isLoading} error={error} />
        {posts && <PostsTable posts={posts} showAuthor={isEditor} />}
        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? "Đang tải…" : "Tải thêm"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
