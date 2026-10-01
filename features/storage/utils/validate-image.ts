import { formatFileSize } from "@/lib/format/file-size";

import { STORAGE_ERROR_MESSAGES } from "../constants";

type ImageRules = { accept: string; maxSize: number };

/**
 * Whether a file matches an `<input accept>` list: exact MIME types
 * (`image/png`), wildcards (`image/*`) or extensions (`.webp`).
 */
export function matchesAccept(file: Pick<File, "name" | "type">, accept: string): boolean {
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** The message to show for a file that cannot be uploaded, or null when it can. */
export function validateImageFile(file: Pick<File, "name" | "type" | "size">, rules: ImageRules): string | null {
  if (!file.type.startsWith("image/")) return STORAGE_ERROR_MESSAGES.notImage;
  if (!matchesAccept(file, rules.accept)) return STORAGE_ERROR_MESSAGES.typeNotAccepted;
  if (file.size > rules.maxSize) return STORAGE_ERROR_MESSAGES.tooLarge(formatFileSize(rules.maxSize));
  return null;
}
