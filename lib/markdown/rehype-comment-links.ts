import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

import { COMMENT_LINK_ATTRIBUTES } from "./constants";

/** Adds rel="nofollow ugc noopener noreferrer" and target="_blank" to every link. */
export function rehypeCommentLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      node.properties = { ...node.properties, rel: COMMENT_LINK_ATTRIBUTES.rel.split(" "), target: COMMENT_LINK_ATTRIBUTES.target };
    });
  };
}
