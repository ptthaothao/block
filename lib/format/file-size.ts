const UNITS = ["B", "KB", "MB", "GB"] as const;
const STEP = 1024;

/** `61_542` -> `60.1 KB`; whole numbers drop the decimal (`4 MB`). */
export function formatFileSize(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= STEP && unit < UNITS.length - 1) {
    value /= STEP;
    unit += 1;
  }
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${UNITS[unit]}`;
}
