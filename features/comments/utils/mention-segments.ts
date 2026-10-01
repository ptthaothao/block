export type TextSegment = { text: string; mention: boolean };

const MENTION = /@[\w.-]+/g;

/** Split text into plain and @mention runs, so the composer can highlight mentions. */
export function splitMentions(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(MENTION)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), mention: false });
    segments.push({ text: match[0], mention: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), mention: false });
  return segments;
}
