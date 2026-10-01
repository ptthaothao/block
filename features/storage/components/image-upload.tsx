"use client";

import { X } from "lucide-react";
import { useId, useState } from "react";

import { formatFileSize } from "@/lib/format/file-size";
import { cn } from "@/lib/utils/cn";

import { DEFAULT_IMAGE_ACCEPT, IMAGE_MAX_BYTES, IMAGE_UPLOAD_LABELS } from "../constants";
import { useImageUpload, type ImageUploadOptions } from "../hooks/use-image-upload";
import { describeAccept } from "../utils/accept-label";
import { ImageDropzone } from "./image-dropzone";
import { ImageUploadItem } from "./image-upload-item";
import { LazyImageLightbox } from "./lazy-image-lightbox";

type ImageUploadProps = Pick<ImageUploadOptions, "bucket" | "path" | "value" | "onChange" | "onRemove"> & {
  /** Allow several images; without it the component holds at most one. */
  multiple?: boolean;
  /** Upper bound on images held (existing + new). Ignored unless `multiple`. */
  maxCount?: number;
  /** `<input accept>` list. Only raster images are stored, whatever this allows. */
  accept?: string;
  /** Bytes per file; capped at IMAGE_MAX_BYTES, which the server enforces. */
  maxSize?: number;
  disabled?: boolean;
  /** Hide the dropzone instead of showing it blocked once `maxCount` is reached. */
  hideDropzoneWhenFull?: boolean;
  /** Id for the file input, so a <label htmlFor> can point at it. */
  id?: string;
  className?: string;
};

/**
 * Upload images to Supabase Storage under `<bucket>/<path>/<uuid>.<ext>`,
 * through our own API. Controlled: `value` holds only images that exist in
 * Storage, so the parent can save it directly; uploads in flight or failed
 * stay inside the component.
 */
export function ImageUpload({
  bucket,
  path,
  value,
  onChange,
  onRemove,
  multiple = false,
  maxCount,
  accept = DEFAULT_IMAGE_ACCEPT,
  maxSize = IMAGE_MAX_BYTES,
  disabled = false,
  hideDropzoneWhenFull = false,
  id,
  className,
}: ImageUploadProps) {
  const fallbackId = useId();
  const limit = multiple ? (maxCount ?? Number.POSITIVE_INFINITY) : 1;
  const sizeLimit = Math.min(maxSize, IMAGE_MAX_BYTES);
  const upload = useImageUpload({ bucket, path, value, onChange, onRemove, maxCount: limit, accept, maxSize: sizeLimit });
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const slides = [
    ...value.map((image) => ({ src: image.url, alt: image.name })),
    ...upload.pending.map((item) => ({ src: item.previewUrl, alt: item.file.name })),
  ];
  const hint = IMAGE_UPLOAD_LABELS.hint(describeAccept(accept), formatFileSize(sizeLimit));
  const isFull = upload.remainingSlots === 0;
  const blockedReason = isFull ? IMAGE_UPLOAD_LABELS.limitReached(limit) : null;

  return (
    <div className={cn("space-y-3", className)}>
      {!(isFull && hideDropzoneWhenFull) && (
        <ImageDropzone
          id={id ?? fallbackId}
          accept={accept}
          multiple={multiple}
          hint={hint}
          blockedReason={blockedReason}
          disabled={disabled}
          onFiles={upload.addFiles}
        />
      )}

      {upload.notices.length > 0 && (
        <ul role="alert" className="space-y-1">
          {upload.notices.map((notice) => (
            <li key={notice.key} className="flex items-start gap-2 text-xs text-danger">
              <span className="min-w-0 flex-1">
                {notice.fileName && <span className="font-medium">{notice.fileName}: </span>}
                {notice.message}
              </span>
              <button type="button" onClick={() => upload.dismissNotice(notice.key)} aria-label={IMAGE_UPLOAD_LABELS.remove}>
                <X aria-hidden className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {slides.length > 0 && (
        <ul className="space-y-2">
          {value.map((image, index) => (
            <ImageUploadItem
              key={image.id}
              src={image.url}
              name={image.name}
              size={image.size}
              status="done"
              disabled={disabled}
              onView={() => setViewIndex(index)}
              onRemove={() => void upload.removeImage(image)}
            />
          ))}
          {upload.pending.map((item, index) => (
            <ImageUploadItem
              key={item.key}
              src={item.previewUrl}
              name={item.file.name}
              size={item.file.size}
              status={item.status}
              error={item.error}
              disabled={disabled}
              onView={() => setViewIndex(value.length + index)}
              onRemove={() => upload.removePending(item.key)}
              onRetry={() => upload.retry(item.key)}
            />
          ))}
        </ul>
      )}

      {viewIndex !== null && slides.length > 0 && (
        <LazyImageLightbox slides={slides} index={Math.min(viewIndex, slides.length - 1)} onClose={() => setViewIndex(null)} />
      )}
    </div>
  );
}
