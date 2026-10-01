"use client";

import { useCallback, useLayoutEffect, useRef, type KeyboardEvent } from "react";

import { MARKDOWN_FORMATS, MARKDOWN_SHORTCUTS, type MarkdownFormatId } from "../constants";
import { applyMarkdownFormat } from "../utils/markdown-format";

type Selection = { start: number; end: number };

/**
 * Toolbar buttons and Ctrl/Cmd shortcuts for a markdown textarea. The new
 * selection is restored after React re-renders the textarea with the new value.
 */
export function useMarkdownFormatting(value: string, onChange: (value: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<Selection | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const selection = pendingSelection.current;
    if (!textarea || !selection) return;
    pendingSelection.current = null;
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
  }, [value]);

  const format = useCallback(
    (id: MarkdownFormatId) => {
      const textarea = textareaRef.current;
      if (!textarea || textarea.readOnly) return;
      const edit = applyMarkdownFormat(value, textarea.selectionStart, textarea.selectionEnd, MARKDOWN_FORMATS[id]);
      pendingSelection.current = { start: edit.selectionStart, end: edit.selectionEnd };
      onChange(edit.text);
    },
    [value, onChange],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
      const id = MARKDOWN_SHORTCUTS[event.key.toLowerCase()];
      if (!id) return;
      event.preventDefault();
      format(id);
    },
    [format],
  );

  return { textareaRef, format, onKeyDown };
}
