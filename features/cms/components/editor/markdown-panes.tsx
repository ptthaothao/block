"use client";

import { useState, type KeyboardEventHandler, type Ref } from "react";

import { Alert } from "@/components/ui/alert";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

import { useMarkdownPreview } from "../../hooks/use-markdown-preview";
import { EditorIcon } from "./editor-icon";
import { MarkdownSourceEditor } from "./markdown-source-editor";
import { PaneHeader } from "./pane-header";

const PANE_TABS = [
  { id: "write", label: "Viết" },
  { id: "preview", label: "Xem trước" },
] as const;
type Pane = (typeof PANE_TABS)[number]["id"];

type MarkdownPanesProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  textareaRef: Ref<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  saveHint: string;
};

/** Markdown on the left, server-rendered preview on the right (tabs on small screens). */
export function MarkdownPanes({ value, onChange, readOnly, textareaRef, onKeyDown, saveHint }: MarkdownPanesProps) {
  const [pane, setPane] = useState<Pane>("write");
  const { html, error } = useMarkdownPreview(value, true);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-editor-line bg-editor-panel px-4 lg:hidden">
        <Tabs label="Chế độ soạn" tabs={PANE_TABS} value={pane} onChange={setPane} className="border-b-0" />
      </div>

      <div className="flex min-h-[32rem] flex-1 lg:min-h-0">
        <section
          aria-label="Soạn Markdown"
          className={cn(
            "flex min-w-0 flex-1 flex-col bg-editor-source lg:border-r lg:border-editor-line",
            pane !== "write" && "max-lg:hidden",
          )}
        >
          <PaneHeader className="bg-editor-panel/60 px-4">
            <span>MARKDOWN EDITOR</span>
            <span>UTF-8 · LF</span>
          </PaneHeader>
          <MarkdownSourceEditor
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            textareaRef={textareaRef}
            onKeyDown={onKeyDown}
          />
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-editor-line/70 bg-editor-header px-4 pt-[9px] pb-2 text-[11px] leading-[16.5px] text-muted">
            <p className="flex items-center gap-1.5" aria-live="polite">
              <EditorIcon name="cloudUpload" />
              {saveHint}
            </p>
            <span className="max-sm:hidden">Markdown đã bật</span>
          </div>
        </section>

        <section
          aria-label="Xem trước"
          className={cn("flex min-w-0 flex-1 flex-col bg-editor-preview", pane !== "preview" && "max-lg:hidden")}
        >
          <PaneHeader className="bg-editor-chip/80 px-6">
            <span className="flex items-center gap-1 font-display font-medium tracking-[0.275px] text-editor-ink">
              <span aria-hidden className="size-2 rounded-full bg-emerald" />
              XEM TRƯỚC BÀI VIẾT (LIVE RENDER)
            </span>
            <span className="text-[10px] leading-[15px] text-faint">Đồng bộ tự động</span>
          </PaneHeader>
          <div className="min-h-0 flex-1 lg:overflow-y-auto">
            <div className="max-w-[672px] space-y-3 p-8">
              {error && <Alert tone="error">{error}</Alert>}
              {value.trim() ? (
                // Rendered and sanitized on the server by the same pipeline as the public page.
                <div className="article-prose prose-base" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-faint">Nội dung xem trước sẽ hiện ở đây khi bạn bắt đầu viết.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
