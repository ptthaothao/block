import type { Element, Root } from "hast";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";

import { TOC_DEPTHS } from "./constants";
import type { TocItem } from "./types";

/** Key `collectHeadings` stores the collected table of contents under on the vfile. */
export const TOC_DATA_KEY = "toc";

function isTocDepth(rank: number | undefined): rank is TocItem["depth"] {
  return TOC_DEPTHS.some((depth) => depth === rank);
}

/**
 * Rehype plugin: collects every h2/h3 (with an id) into the vfile's data
 * under `TOC_DATA_KEY`, instead of closing over a `toc` array, so the
 * processor instance can be built once and reused across calls. Run after
 * rehype-slug.
 */
export function collectHeadings() {
  return (tree: Root, file: VFile) => {
    const toc: TocItem[] = [];
    visit(tree, "element", (node: Element) => {
      const rank = headingRank(node);
      const id = node.properties?.id;
      if (!isTocDepth(rank) || typeof id !== "string") return;
      toc.push({ id, text: toString(node).trim(), depth: rank });
    });
    file.data[TOC_DATA_KEY] = toc;
  };
}
