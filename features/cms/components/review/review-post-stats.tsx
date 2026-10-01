import { ShieldCheck } from "lucide-react";

import { CMS_LIMITS, POST_LEVEL_OPTIONS } from "../../constants";
import type { CmsPost } from "../../types";

/** Facts about the post the reviewer checks before publishing. */
export function ReviewPostStats({ post }: { post: CmsPost }) {
  const rows = [
    { label: "Cấp độ", value: POST_LEVEL_OPTIONS.find((o) => o.value === post.level)?.label ?? post.level },
    { label: "Thẻ", value: `${post.tags.length} / ${CMS_LIMITS.tagsPerPost}` },
    { label: "Ảnh bìa", value: post.coverUrl ? "Có" : "Chưa có" },
    { label: "Tiêu đề SEO", value: post.seoTitle ? "Có" : "Dùng tiêu đề bài" },
  ];

  return (
    <section className="rounded-xl border border-editor-line bg-editor-panel p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-text">
        <ShieldCheck aria-hidden className="size-4 text-accent" />
        Thông số kiểm duyệt
      </h3>
      <dl className="mt-3 divide-y divide-editor-line/60 text-xs">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-mono font-medium text-accent-hover">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
