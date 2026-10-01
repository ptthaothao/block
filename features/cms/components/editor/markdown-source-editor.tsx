import { Fragment, type KeyboardEventHandler, type Ref } from "react";

import { LINE_NUMBER_DIGITS } from "../../constants";

type MarkdownSourceEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  textareaRef: Ref<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
};

/**
 * A textarea with a line-number gutter. Each source line is mirrored
 * (invisibly) next to its number, so a soft-wrapped line pushes the next
 * number down exactly as far as the textarea wraps it.
 */
export function MarkdownSourceEditor({ value, onChange, readOnly, textareaRef, onKeyDown }: MarkdownSourceEditorProps) {
  const lines = value.split("\n");

  return (
    <div className="min-h-0 flex-1 lg:overflow-y-auto">
      <div className="relative grid min-h-full grid-cols-[3rem_minmax(0,1fr)] content-start p-4 font-mono text-sm leading-5">
        {lines.map((line, index) => (
          <Fragment key={index}>
            <span aria-hidden className="pr-4 text-right text-xs leading-5 text-editor-gutter opacity-60 select-none">
              {String(index + 1).padStart(LINE_NUMBER_DIGITS, "0")}
            </span>
            <span aria-hidden className="invisible pl-2 whitespace-pre-wrap wrap-break-word">
              {line || " "}
            </span>
          </Fragment>
        ))}
        <textarea
          ref={textareaRef}
          aria-label="Nội dung Markdown"
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          placeholder="## Bắt đầu viết bằng Markdown…"
          className="absolute inset-y-4 right-4 left-16 resize-none overflow-hidden border-0 bg-transparent p-0 pl-2 whitespace-pre-wrap wrap-break-word text-editor-ink caret-accent placeholder:text-faint focus:outline-none"
        />
      </div>
    </div>
  );
}
