"use client";

import { useCallback } from "react";

import { useCmsTaxonomy } from "../../hooks/use-cms-queries";
import { useMarkdownFormatting } from "../../hooks/use-markdown-formatting";
import { usePostEditor } from "../../hooks/use-post-editor";
import type { CmsPost } from "../../types";
import { saveHint } from "../../utils/save-hint";
import { QueryState } from "../query-state";
import { PostStatusBadge } from "../status-badge";
import { EditorIcon } from "./editor-icon";
import { MarkdownPanes } from "./markdown-panes";
import { MarkdownToolbar } from "./markdown-toolbar";
import { PostSettings } from "./post-settings";
import { PostTitleHeader } from "./post-title-header";
import { PublishActions } from "./publish-actions";

type PostEditorProps = {
  post: CmsPost | null;
  /** Absolute site origin, for the slug and search previews. */
  siteUrl: string;
};

/**
 * Full-bleed workspace: title, toolbar and markdown/preview panes on the left,
 * settings sidebar on the right. On large screens it fills the viewport under
 * the CMS topbar (h-16) and each column scrolls on its own.
 */
export function PostEditor({ post, siteUrl }: PostEditorProps) {
  const editor = usePostEditor(post);
  const taxonomy = useCmsTaxonomy();
  const { values, update, canEdit, saved, saveState } = editor;
  const onContentChange = useCallback((content: string) => update("contentMd", content), [update]);
  const formatting = useMarkdownFormatting(values.contentMd, onContentChange);

  return (
    <div className="flex flex-col font-display lg:h-[calc(100dvh-4rem)] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col bg-editor-base lg:overflow-hidden lg:border-r lg:border-editor-line">
        <PostTitleHeader editor={editor} post={post} siteUrl={siteUrl} />
        <MarkdownToolbar onFormat={formatting.format} disabled={!canEdit} />
        <MarkdownPanes
          value={values.contentMd}
          onChange={onContentChange}
          readOnly={!canEdit}
          textareaRef={formatting.textareaRef}
          onKeyDown={formatting.onKeyDown}
          saveHint={saveHint(saveState, { saved: saved !== null, canEdit })}
        />
      </div>

      <aside aria-label="Thiết lập bài viết" className="flex flex-col bg-editor-panel lg:w-96 lg:shrink-0 lg:overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-editor-chip/60 px-5 py-3.5 backdrop-blur-md">
          <h2 className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.6px] text-editor-ink uppercase">
            <EditorIcon name="adjustments" />
            Thiết lập bài viết
          </h2>
          <PostStatusBadge status={saved?.status ?? "draft"} />
        </div>
        <div className="px-5 empty:hidden">
          <QueryState isLoading={taxonomy.isLoading} error={taxonomy.error} />
        </div>
        {taxonomy.data && <PostSettings editor={editor} taxonomy={taxonomy.data} siteUrl={siteUrl} />}
        <PublishActions editor={editor} />
      </aside>
    </div>
  );
}
