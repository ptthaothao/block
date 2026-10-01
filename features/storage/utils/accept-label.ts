/** Human list of accepted formats for the hint, e.g. `image/png,.webp` -> `PNG, WEBP`. */
export function describeAccept(accept: string): string {
  const labels = accept
    .split(",")
    .map((rule) => rule.trim())
    .filter((rule) => rule && !rule.endsWith("/*"))
    .map((rule) => (rule.startsWith(".") ? rule.slice(1) : (rule.split("/")[1] ?? rule)).toUpperCase())
    .map((label) => (label === "JPEG" ? "JPG" : label));
  return [...new Set(labels)].join(", ");
}
