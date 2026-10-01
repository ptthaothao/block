import { EmptyState } from "@/components/ui/empty-state";
import { TextLink } from "@/components/ui/text-link";
import { ROUTES } from "@/config/routes";
import { formatDateTime } from "@/lib/format/date";

import type { CmsPostListItem } from "../types";
import { PostStatusBadge } from "./status-badge";

type PostsTableProps = { posts: CmsPostListItem[]; showAuthor?: boolean };

export function PostsTable({ posts, showAuthor }: PostsTableProps) {
  if (posts.length === 0) return <EmptyState title="Chưa có bài nào ở đây" />;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface font-mono text-xs uppercase tracking-wider text-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Tiêu đề</th>
            {showAuthor && <th className="px-4 py-3 font-medium">Tác giả</th>}
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Cập nhật</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-surface/60">
              <td className="px-4 py-3">
                <TextLink href={ROUTES.cmsEditPost(post.id)} className="font-medium text-text hover:text-accent">
                  {post.title}
                </TextLink>
                {post.categoryName && <p className="mt-0.5 font-mono text-xs text-faint">{post.categoryName}</p>}
                {post.reviewNote && post.status === "draft" && (
                  <p className="mt-1 text-xs text-warning">Biên tập viên: {post.reviewNote}</p>
                )}
              </td>
              {showAuthor && <td className="px-4 py-3 text-muted">{post.authorName}</td>}
              <td className="px-4 py-3">
                <PostStatusBadge status={post.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(post.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
