const MONOGRAM_LENGTH = 2;

/** Placeholder text for a series without a cover: the first letters of its first word, e.g. "Laravel từ A-Z" -> "LA". */
export function seriesMonogram(title: string): string {
  const firstWord = title.trim().split(/\s+/)[0] ?? "";
  return firstWord.slice(0, MONOGRAM_LENGTH).toUpperCase();
}
