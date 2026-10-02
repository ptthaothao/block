const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Soft glow in the category's colour for posts without a cover; falls back to the accent colour. */
export function coverFallbackBackground(color: string | null): string {
  const tint = color && HEX_COLOR.test(color) ? color : "var(--accent)";
  return [
    `radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, ${tint} 38%, transparent), transparent 60%)`,
    `radial-gradient(90% 80% at 100% 100%, color-mix(in srgb, ${tint} 18%, transparent), transparent 65%)`,
    "var(--surface-sunken)",
  ].join(", ");
}
