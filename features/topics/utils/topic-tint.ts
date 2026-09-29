import { TOPIC_TINT_ALPHA } from "../constants";

/** A topic colour as a translucent tint (e.g. `#38bdf8` -> `rgb(56 189 248 / 0.12)`), or null for bad input. */
export function topicTint(color: string | null, alpha: number = TOPIC_TINT_ALPHA.surface): string | null {
  const match = color?.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  const [r, g, b] = match.slice(1).map((hex) => parseInt(hex, 16));
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
