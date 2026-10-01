"use client";

import { useState, type ComponentProps } from "react";

import type { StoredImage } from "../types";
import { storedImageFromUrl } from "../utils/stored-image";
import { ImageUpload } from "./image-upload";

type ImageUrlUploadProps = Omit<ComponentProps<typeof ImageUpload>, "value" | "onChange" | "multiple" | "maxCount"> & {
  /** Public URL of the current image; "" or null for none. */
  value: string | null;
  onChange: (url: string) => void;
};

/**
 * Single-image ImageUpload for forms that store only a URL (e.g. a
 * `cover_url` column). Keeps the uploaded image's name and size while its
 * URL is the value; otherwise rebuilds it from the URL.
 */
export function ImageUrlUpload({ value, onChange, ...props }: ImageUrlUploadProps) {
  const [current, setCurrent] = useState<StoredImage | null>(null);
  const image = value ? (current?.url === value ? current : storedImageFromUrl(value)) : null;

  const handleChange = (images: StoredImage[]) => {
    const next = images[0] ?? null;
    setCurrent(next);
    onChange(next?.url ?? "");
  };

  return <ImageUpload {...props} value={image ? [image] : []} onChange={handleChange} />;
}
