import type { CategoryTreeNode, CmsCategory } from "../types";

const byPosition = (a: CmsCategory, b: CmsCategory) => a.position - b.position || a.id - b.id;

/** Top-level categories, each with its children, both in position order. */
export function buildCategoryTree(categories: CmsCategory[]): CategoryTreeNode[] {
  return categories
    .filter((c) => c.parentId === null)
    .sort(byPosition)
    .map((category) => {
      const children = categories.filter((c) => c.parentId === category.id).sort(byPosition);
      const totalPosts = children.reduce((sum, child) => sum + child.postCount, category.postCount);
      return { category, children, totalPosts };
    });
}

function matches(category: CmsCategory, query: string) {
  return category.name.toLowerCase().includes(query) || category.slug.includes(query);
}

/**
 * Keeps parents that match (with all their children) and parents with a
 * matching child (with only those children). An empty query keeps everything.
 */
export function filterCategoryTree(tree: CategoryTreeNode[], rawQuery: string): CategoryTreeNode[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return tree;
  return tree.flatMap((node) => {
    if (matches(node.category, query)) return [node];
    const children = node.children.filter((child) => matches(child, query));
    return children.length > 0 ? [{ ...node, children }] : [];
  });
}
