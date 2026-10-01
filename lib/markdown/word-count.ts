/** Whitespace-separated words, the same count reading time is based on. */
export function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}
