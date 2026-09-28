"use client";

import { useQuery } from "@tanstack/react-query";
import { Bold, Code, Italic, Link2, SquareCode } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils/cn";

import { previewComment } from "../actions";
import { COMMENT_COPY, COMMENT_LIMITS, COMMENT_TIMINGS, COMPOSER_TOOLS, type ComposerToolId } from "../constants";
import { applyComposerTool } from "../utils/composer-text";

const TOOL_ICONS: Record<ComposerToolId, typeof Bold> = {
  bold: Bold,
  italic: Italic,
  code: Code,
  codeBlock: SquareCode,
  link: Link2,
};

const EDITOR_TABS = [
  { id: "write", label: COMMENT_COPY.write },
  { id: "preview", label: COMMENT_COPY.preview },
] as const;
type EditorTab = (typeof EDITOR_TABS)[number]["id"];

type CommentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** Fill the available height (the full-screen sheet on phones). */
  fill?: boolean;
};

/** Write | Preview, a small Markdown toolbar, a counter near the limit and Ctrl/⌘+Enter to send. */
export function CommentEditor({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  submitLabel = COMMENT_COPY.send,
  autoFocus,
  fill = false,
}: CommentEditorProps) {
  const [tab, setTab] = useState<EditorTab>("write");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const debounced = useDebouncedValue(value, COMMENT_TIMINGS.previewDebounceMs);
  const preview = useQuery({
    queryKey: ["comments", "preview", debounced],
    queryFn: async () => {
      const result = await previewComment(debounced);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    enabled: tab === "preview" && debounced.trim().length > 0,
    staleTime: Infinity,
  });

  const length = value.length;
  const tooLong = length > COMMENT_LIMITS.bodyMax;
  const canSend = value.trim().length > 0 && !tooLong;

  const applyTool = (id: ComposerToolId) => {
    const el = textarea.current;
    if (!el) return;
    const next = applyComposerTool({ value, start: el.selectionStart, end: el.selectionEnd }, id);
    onChange(next.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.start, next.end);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (canSend) onSubmit();
    }
    if (event.key === "Escape" && onCancel) onCancel();
  };

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-surface-sunken", fill && "min-h-0 flex-1")}>
      <div className="flex items-center justify-between gap-2 border-b border-border pr-2">
        <Tabs tabs={EDITOR_TABS} value={tab} onChange={setTab} label={COMMENT_COPY.preview} className="shrink-0 flex-nowrap gap-0 border-b-0" />
        {tab === "write" && (
          <div role="toolbar" aria-label={COMMENT_COPY.toolbarLabel} className="flex min-w-0 items-center overflow-x-auto">
            {COMPOSER_TOOLS.map((tool) => {
              const Icon = TOOL_ICONS[tool.id];
              return (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  onClick={() => applyTool(tool.id)}
                  className="grid size-9 place-items-center rounded-md text-faint transition hover:bg-surface-hover hover:text-text"
                >
                  <Icon aria-hidden className="size-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {tab === "write" ? (
        <Textarea
          ref={textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus={autoFocus}
          rows={fill ? undefined : 4}
          className={cn("resize-y rounded-none border-0 bg-transparent focus:border-0", fill && "min-h-0 flex-1 resize-none")}
        />
      ) : (
        <div className={cn("comment-prose min-h-28 px-4 py-3 text-sm", fill && "flex-1 overflow-y-auto")} aria-live="polite">
          {!value.trim() ? (
            <p className="text-faint">{COMMENT_COPY.previewEmpty}</p>
          ) : preview.data !== undefined && debounced === value ? (
            <div dangerouslySetInnerHTML={{ __html: preview.data }} />
          ) : (
            <p className="text-faint">{COMMENT_COPY.previewLoading}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2">
        <p className="text-xs text-faint">
          {COMMENT_COPY.markdownHint}
          <span className="max-sm:hidden"> · {COMMENT_COPY.shortcutHint}</span>
          {length >= COMMENT_LIMITS.counterFrom && (
            <span className={cn("ml-2 font-mono tabular-nums", tooLong && "text-danger")}>
              {COMMENT_COPY.counter(length, COMMENT_LIMITS.bodyMax)}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" className="px-3 py-2 text-sm" onClick={onCancel}>
              {COMMENT_COPY.cancel}
            </Button>
          )}
          <Button size="sm" onClick={onSubmit} disabled={!canSend}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
