"use server";

import { authorize } from "@/features/auth/guards";
import { renderMarkdownPreview } from "@/lib/markdown/render";

import { CMS_ERROR_MESSAGES, CMS_LIMITS } from "../constants";
import type { ActionResult } from "../types";
import { fail, ok } from "../utils/action-error";

/**
 * Same sanitizing as the published output, but without syntax highlighting
 * (Shiki is the most expensive step and doesn't matter for a live preview).
 * The full render with highlighting runs once, at save/publish time.
 */
export async function previewMarkdown(markdown: string): Promise<ActionResult<string>> {
  const user = await authorize("author");
  if (!user) return fail(CMS_ERROR_MESSAGES.forbidden);
  if (markdown.length > CMS_LIMITS.contentMax) return fail(CMS_ERROR_MESSAGES.invalid);
  const html = await renderMarkdownPreview(markdown);
  return ok(html);
}
