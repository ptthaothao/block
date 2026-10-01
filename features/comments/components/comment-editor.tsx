"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { COMMENT_COPY, COMMENT_LIMITS } from "../constants";
import { splitMentions } from "../utils/mention-segments";

type CommentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** The reader's avatar, left of the field. */
  leading?: ReactNode;
  hint?: string;
};

/**
 * One compact, rounded field that grows with its text: Enter sends, Shift+Enter
 * adds a line, Esc cancels. Mentions are highlighted by a mirror layer under the
 * transparent textarea, which also gives the field its height.
 */
export function CommentEditor({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  submitLabel = COMMENT_COPY.send,
  autoFocus,
  leading,
  hint,
}: CommentEditorProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const tooLong = value.length > COMMENT_LIMITS.bodyMax;
  const canSend = value.trim().length > 0 && !tooLong;

  // Open with the caret after any prefilled mention, never with the text selected.
  useEffect(() => {
    const el = textarea.current;
    if (!autoFocus || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [autoFocus]);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape" && onCancel) {
      event.preventDefault();
      onCancel();
      return;
    }
    // Enter confirms an IME composition (Telex, VNI…); it must not send.
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canSend) onSubmit();
  };

  return (
    <div className="flex items-start gap-2">
      {leading}
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-1 rounded-2xl border border-border bg-surface-sunken py-1.5 pl-3.5 pr-1.5 focus-within:border-accent">
          <div className="grid min-w-0 flex-1 text-sm leading-6">
            <div aria-hidden className="col-start-1 row-start-1 whitespace-pre-wrap break-words py-0.5">
              {splitMentions(value).map((segment, index) =>
                segment.mention ? (
                  <span key={index} className="rounded bg-accent/20 text-accent">
                    {segment.text}
                  </span>
                ) : (
                  segment.text
                ),
              )}
              {"​"}
            </div>
            <textarea
              ref={textarea}
              value={value}
              rows={1}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              aria-label={placeholder}
              className="col-start-1 row-start-1 w-full resize-none overflow-hidden bg-transparent py-0.5 text-transparent caret-text placeholder:text-faint focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSend}
            aria-label={submitLabel}
            title={submitLabel}
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full transition",
              canSend ? "text-accent hover:bg-accent/15" : "text-faint",
            )}
          >
            <SendHorizontal aria-hidden className="size-4" />
          </button>
        </div>
        {(hint || value.length >= COMMENT_LIMITS.counterFrom) && (
          <p className="mt-1 px-3 text-xs text-faint">
            {hint}
            {value.length >= COMMENT_LIMITS.counterFrom && (
              <span className={cn("ml-2 font-mono tabular-nums", tooLong && "text-danger")}>
                {COMMENT_COPY.counter(value.length, COMMENT_LIMITS.bodyMax)}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
