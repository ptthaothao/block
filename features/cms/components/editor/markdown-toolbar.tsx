import { Fragment } from "react";

import { cn } from "@/lib/utils/cn";

import { MARKDOWN_TOOLBAR, type MarkdownFormatId } from "../../constants";
import { EditorIcon } from "./editor-icon";

type MarkdownToolbarProps = { onFormat: (format: MarkdownFormatId) => void; disabled?: boolean };

export function MarkdownToolbar({ onFormat, disabled }: MarkdownToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-editor-line bg-editor-panel px-6 pt-1.5 pb-[7px]">
      <div role="toolbar" aria-label="Định dạng Markdown" className="flex items-center gap-1">
        {MARKDOWN_TOOLBAR.map((group, index) => (
          <Fragment key={index}>
            {index > 0 && <span aria-hidden className="mx-0.5 h-3.5 w-px shrink-0 bg-editor-line" />}
            {group.map((button) => (
              <button
                key={button.format}
                type="button"
                title={button.label}
                aria-label={button.label}
                disabled={disabled}
                // Keep focus (and the selection) in the textarea.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onFormat(button.format)}
                className="grid min-w-6 place-items-center rounded-sm p-1.5 text-xs leading-4 text-muted transition hover:bg-editor-chip hover:text-text disabled:pointer-events-none disabled:opacity-50"
              >
                {"icon" in button ? (
                  <EditorIcon name={button.icon} />
                ) : (
                  <span aria-hidden className={cn(button.textClassName)}>
                    {button.text}
                  </span>
                )}
              </button>
            ))}
          </Fragment>
        ))}
      </div>
      <p className="flex shrink-0 items-center gap-1 text-[11px] leading-4 text-faint max-sm:hidden">
        <EditorIcon name="info" />
        Hỗ trợ Markdown (GFM)
      </p>
    </div>
  );
}
