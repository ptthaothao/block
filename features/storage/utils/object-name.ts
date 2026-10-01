import { IMAGE_MIME_EXTENSIONS, type ImageMimeType } from "../constants";

/**
 * Collision-free object name: `<uuid>.<ext>`. The extension comes from the
 * verified MIME type, never from the user's file name.
 */
export function createObjectName(mimeType: ImageMimeType, id: string = crypto.randomUUID()): string {
  return `${id}.${IMAGE_MIME_EXTENSIONS[mimeType]}`;
}

export function isImageMimeType(type: string): type is ImageMimeType {
  return Object.hasOwn(IMAGE_MIME_EXTENSIONS, type);
}
