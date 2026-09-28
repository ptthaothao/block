import "server-only";

import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { COMMENT_SANITIZE_SCHEMA } from "./constants";
import { rehypeCommentLinks } from "./rehype-comment-links";

function buildCommentProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, COMMENT_SANITIZE_SCHEMA)
    .use(rehypeCommentLinks)
    .use(rehypeStringify);
}

let commentProcessor: ReturnType<typeof buildCommentProcessor> | undefined;

/**
 * Comment Markdown to safe HTML. Stricter than posts (see
 * COMMENT_SANITIZE_SCHEMA) and cheap (no syntax highlighting), so it runs
 * every time comments are read instead of trusting stored HTML.
 */
export async function renderCommentMarkdown(markdown: string): Promise<string> {
  commentProcessor ??= buildCommentProcessor();
  return String(await commentProcessor.process(markdown));
}
