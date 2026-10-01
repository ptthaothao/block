import { MIN_READING_MINUTES, WORDS_PER_MINUTE } from "./constants";
import { countWords } from "./word-count";

export function estimateReadingMinutes(markdown: string): number {
  return Math.max(MIN_READING_MINUTES, Math.round(countWords(markdown) / WORDS_PER_MINUTE));
}
