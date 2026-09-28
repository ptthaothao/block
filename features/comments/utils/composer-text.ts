import { COMPOSER_TOOLS, type ComposerToolId } from "../constants";

type Selection = { value: string; start: number; end: number };

/** Wrap the selection (or a placeholder) with a toolbar tool's Markdown. Returns the new text and selection. */
export function applyComposerTool({ value, start, end }: Selection, toolId: ComposerToolId): Selection {
  const tool = COMPOSER_TOOLS.find((t) => t.id === toolId) ?? COMPOSER_TOOLS[0];
  const selected = value.slice(start, end) || tool.placeholder;
  const next = value.slice(0, start) + tool.before + selected + tool.after + value.slice(end);
  const selStart = start + tool.before.length;
  return { value: next, start: selStart, end: selStart + selected.length };
}

/** "@username " to start a reply to a reply, unless the text already mentions them. */
export function mentionPrefix(username: string, current: string): string {
  const mention = `@${username} `;
  return current.startsWith(mention) ? current : mention + current;
}
