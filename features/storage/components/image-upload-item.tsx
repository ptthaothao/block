import { LoaderCircle, RotateCw, X } from "lucide-react";

import { formatFileSize } from "@/lib/format/file-size";

import { IMAGE_UPLOAD_LABELS } from "../constants";
import { ImageThumb } from "./image-thumb";

type ImageUploadItemProps = {
  src: string;
  name: string;
  size: number | null;
  status: "done" | "uploading" | "error";
  error?: string | null;
  disabled?: boolean;
  onView: () => void;
  onRemove: () => void;
  onRetry?: () => void;
};

const iconButton =
  "grid size-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text disabled:pointer-events-none disabled:opacity-50";

/** One row in the ImageUpload list: thumbnail (opens the lightbox), name, size or status. */
export function ImageUploadItem({ src, name, size, status, error, disabled, onView, onRemove, onRetry }: ImageUploadItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
      <button
        type="button"
        onClick={onView}
        aria-label={`${IMAGE_UPLOAD_LABELS.view}: ${name}`}
        className="relative grid size-12 shrink-0 cursor-zoom-in place-items-center overflow-hidden rounded-md bg-surface-sunken focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ImageThumb src={src} alt="" dimmed={status !== "done"} />
        {status === "uploading" && <LoaderCircle aria-hidden className="relative size-5 animate-spin text-text" />}
      </button>

      <div className="min-w-0 flex-1" role={status === "done" ? undefined : "status"}>
        <p className="truncate text-sm font-medium text-text">{name}</p>
        {status === "error" ? (
          <p className="truncate text-xs text-danger">{error ?? IMAGE_UPLOAD_LABELS.failed}</p>
        ) : (
          <p className="text-xs text-faint">
            {status === "uploading" ? IMAGE_UPLOAD_LABELS.uploading : size !== null && formatFileSize(size)}
          </p>
        )}
      </div>

      {status === "error" && onRetry && (
        <button type="button" onClick={onRetry} disabled={disabled} aria-label={IMAGE_UPLOAD_LABELS.retry} className={iconButton}>
          <RotateCw aria-hidden className="size-4" />
        </button>
      )}
      <button type="button" onClick={onRemove} disabled={disabled} aria-label={`${IMAGE_UPLOAD_LABELS.remove}: ${name}`} className={iconButton}>
        <X aria-hidden className="size-4" />
      </button>
    </li>
  );
}
