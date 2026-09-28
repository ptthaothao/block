import "server-only";

import rehypeShiki from "@shikijs/rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { CODE_THEME, SANITIZE_SCHEMA } from "./constants";
import { estimateReadingMinutes } from "./reading-time";
import { collectHeadings, TOC_DATA_KEY } from "./rehype-collect-toc";
import type { RenderedMarkdown, TocItem } from "./types";

function buildFullProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, SANITIZE_SCHEMA)
    .use(rehypeSlug)
    .use(collectHeadings)
    .use(rehypeShiki, { theme: CODE_THEME })
    .use(rehypeStringify);
}

function buildPreviewProcessor() {
  // No syntax highlighting: Shiki is by far the most expensive step, and a
  // live preview while typing doesn't need highlighted code blocks.
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, SANITIZE_SCHEMA)
    .use(rehypeSlug)
    .use(rehypeStringify);
}

// Built once per server instance and reused: Shiki loads its theme/grammars
// (WASM) on first use, so recreating the processor on every call would pay
// that cost again each time.
let fullProcessor: ReturnType<typeof buildFullProcessor> | undefined;
let previewProcessor: ReturnType<typeof buildPreviewProcessor> | undefined;

function getFullProcessor() {
  fullProcessor ??= buildFullProcessor();
  return fullProcessor;
}

function getPreviewProcessor() {
  previewProcessor ??= buildPreviewProcessor();
  return previewProcessor;
}

/**
 * Markdown to sanitized HTML with highlighted code, a table of contents and a
 * reading time. Runs when a post is published (or when a cached page is
 * built), never in the browser.
 */
export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const file = await getFullProcessor().process(markdown);
  return {
    html: String(file),
    toc: (file.data[TOC_DATA_KEY] as TocItem[] | undefined) ?? [],
    readingMinutes: estimateReadingMinutes(markdown),
  };
}

/**
 * Cheap markdown-to-HTML for the live author preview: same sanitizing as the
 * published output, but no syntax highlighting (Shiki) and no reading-time
 * pass, since neither matters while typing.
 */
export async function renderMarkdownPreview(markdown: string): Promise<string> {
  const file = await getPreviewProcessor().process(markdown);
  return String(file);
}
