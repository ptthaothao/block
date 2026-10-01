import { ROUTES } from "@/config/routes";

import { isPostEditorPath } from "./editor-path";

/** CMS pages that fill the viewport with their own columns instead of the centered content column. */
export function isFullBleedPath(pathname: string): boolean {
  return isPostEditorPath(pathname) || pathname === ROUTES.cmsReview;
}
