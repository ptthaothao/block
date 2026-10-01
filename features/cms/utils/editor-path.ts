import { ROUTES } from "@/config/routes";

const POST_EDITOR_PREFIX = `${ROUTES.cmsPosts}/`;

/** /cms/posts/new and /cms/posts/<id>: the full-bleed post editor, not the list. */
export function isPostEditorPath(pathname: string): boolean {
  if (!pathname.startsWith(POST_EDITOR_PREFIX)) return false;
  const rest = pathname.slice(POST_EDITOR_PREFIX.length);
  return rest.length > 0 && !rest.includes("/");
}
