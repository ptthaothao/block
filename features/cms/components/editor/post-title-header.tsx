import { Alert } from "@/components/ui/alert";
import { ROUTES } from "@/config/routes";
import { DATE_LOCALE } from "@/lib/format/constants";
import { estimateReadingMinutes } from "@/lib/markdown/reading-time";
import { countWords } from "@/lib/markdown/word-count";

import { CMS_LIMITS } from "../../constants";
import type { PostEditorState } from "../../hooks/use-post-editor";
import type { CmsPost } from "../../types";
import { SlugField } from "./slug-field";

type PostTitleHeaderProps = { editor: PostEditorState; post: CmsPost | null; siteUrl: string };

/** Title, slug and length of the post, plus any notice about it. */
export function PostTitleHeader({ editor, post, siteUrl }: PostTitleHeaderProps) {
  const { values, update, canEdit, error } = editor;
  const words = countWords(values.contentMd);

  return (
    <header className="flex shrink-0 flex-col gap-2 border-b border-editor-line/70 bg-editor-header px-6 pt-5 pb-[13px]">
      <input
        aria-label="Tiêu đề"
        value={values.title}
        readOnly={!canEdit}
        maxLength={CMS_LIMITS.titleMax}
        onChange={(event) => update("title", event.target.value)}
        placeholder="Tiêu đề bài viết"
        className="w-full bg-transparent font-display text-[30px] leading-9 font-bold tracking-[-0.75px] text-white placeholder:text-faint focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2 font-mono">
        <span className="text-xs leading-4 text-faint">
          {new URL(siteUrl).host}
          {ROUTES.posts}/
        </span>
        <SlugField value={values.slug} onChange={(slug) => update("slug", slug)} readOnly={!canEdit} siteUrl={siteUrl} />
        <span className="text-[11px] leading-4 text-faint">
          · {words.toLocaleString(DATE_LOCALE)} từ · ~{estimateReadingMinutes(values.contentMd)} phút đọc
        </span>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {post?.reviewNote && post.status === "draft" && (
        <Alert tone="warning">Biên tập viên nhắn: {post.reviewNote}</Alert>
      )}
      {!canEdit && (
        <Alert tone="info">Bài đã gửi đi hoặc đã đăng. Chỉ biên tập viên mới sửa được lúc này.</Alert>
      )}
    </header>
  );
}
