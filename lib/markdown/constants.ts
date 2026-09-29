import { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";

export const WORDS_PER_MINUTE = 200;

export const MIN_READING_MINUTES = 1;

export const CODE_THEME = "github-dark-default";

/** Headings that appear in the table of contents. */
export const TOC_DEPTHS = [2, 3] as const;

// Keep GitHub-style defaults, but don't prefix heading ids with "user-content-"
// so TOC anchors stay readable. rehype-slug adds ids after sanitizing.
export const SANITIZE_SCHEMA = { ...defaultSchema, clobberPrefix: "" };

/**
 * Comments: a small, strict subset. No raw HTML, images, headings, tables or
 * ids; links only to http(s)/mailto. Anything else is unwrapped to its text.
 */
export const COMMENT_SANITIZE_SCHEMA: SanitizeSchema = {
  tagNames: ["p", "br", "strong", "em", "del", "code", "pre", "a", "ul", "ol", "li", "blockquote", "hr"],
  attributes: { a: ["href"], code: [["className", /^language-[\w-]+$/]] },
  protocols: { href: ["http", "https", "mailto"] },
  strip: ["script", "style", "iframe", "object", "embed", "img"],
  clobberPrefix: "comment-",
};

/** Every link in a comment opens in a new tab and passes no ranking or referrer. */
export const COMMENT_LINK_ATTRIBUTES = { rel: "nofollow ugc noopener noreferrer", target: "_blank" } as const;
