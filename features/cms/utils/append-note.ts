/** Add `text` as a new line of the reviewer's note, cut to `max` characters. */
export function appendNoteLine(note: string, text: string, max: number): string {
  const trimmed = note.trimEnd();
  return (trimmed ? `${trimmed}\n${text}` : text).slice(0, max);
}
