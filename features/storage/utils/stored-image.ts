import type { StoredImage } from "../types";

const PUBLIC_OBJECT_MARKER = "/storage/v1/object/public/";

/**
 * Rebuild a StoredImage from a saved Supabase public URL, so an entity that
 * only stores the URL (e.g. `cover_url`) can be passed as an initial `value`.
 * Returns null for URLs that are not public Storage objects.
 */
export function storedImageFromUrl(url: string): StoredImage | null {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return null;
  }
  const markerIndex = pathname.indexOf(PUBLIC_OBJECT_MARKER);
  if (markerIndex === -1) return null;

  const [bucket, ...rest] = pathname.slice(markerIndex + PUBLIC_OBJECT_MARKER.length).split("/");
  const path = decodeURIComponent(rest.join("/"));
  if (!bucket || !path) return null;
  return { id: path, bucket, path, url, name: path.split("/").at(-1) ?? path, size: null };
}
