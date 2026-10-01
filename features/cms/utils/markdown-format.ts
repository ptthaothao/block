import type { MarkdownFormat, TextEdit } from "../types";

const HEADING_PREFIX = /^#{1,6} /;
const LINE_BREAK = "\n";

function wrapSelection(text: string, start: number, end: number, before: string, after: string, placeholder: string): TextEdit {
  const inner = text.slice(start, end) || placeholder;
  const innerStart = start + before.length;
  return {
    text: text.slice(0, start) + before + inner + after + text.slice(end),
    selectionStart: innerStart,
    selectionEnd: innerStart + inner.length,
  };
}

/** Strip any heading mark first, so H1 -> H2 replaces instead of stacking "## # ". */
function withoutPrefix(line: string, prefix: string): string {
  if (HEADING_PREFIX.test(prefix)) return line.replace(HEADING_PREFIX, "");
  return line.startsWith(prefix) ? line.slice(prefix.length) : line;
}

/** Prefix every line the selection touches; if they all have it already, remove it. */
function toggleLinePrefix(text: string, start: number, end: number, prefix: string): TextEdit {
  const blockStart = text.lastIndexOf(LINE_BREAK, start - 1) + 1;
  const nextBreak = text.indexOf(LINE_BREAK, end);
  const blockEnd = nextBreak === -1 ? text.length : nextBreak;
  const lines = text.slice(blockStart, blockEnd).split(LINE_BREAK);
  const allPrefixed = lines.every((line) => line.startsWith(prefix));
  const block = lines
    .map((line) => (allPrefixed ? line.slice(prefix.length) : prefix + withoutPrefix(line, prefix)))
    .join(LINE_BREAK);
  return {
    text: text.slice(0, blockStart) + block + text.slice(blockEnd),
    selectionStart: blockStart,
    selectionEnd: blockStart + block.length,
  };
}

/** Insert a snippet on a line of its own, replacing the selection. */
function insertBlock(text: string, start: number, end: number, snippet: string): TextEdit {
  const lead = start > 0 && text[start - 1] !== LINE_BREAK ? LINE_BREAK : "";
  const inserted = lead + snippet;
  const caret = start + inserted.length;
  return { text: text.slice(0, start) + inserted + text.slice(end), selectionStart: caret, selectionEnd: caret };
}

/** Apply a toolbar format to `text` at the given selection, returning the new text and selection. */
export function applyMarkdownFormat(text: string, start: number, end: number, format: MarkdownFormat): TextEdit {
  switch (format.kind) {
    case "wrap":
      return wrapSelection(text, start, end, format.before, format.after, format.placeholder);
    case "line":
      return toggleLinePrefix(text, start, end, format.prefix);
    case "block":
      return insertBlock(text, start, end, format.snippet);
  }
}
