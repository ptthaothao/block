"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

import { IMAGE_UPLOAD_LABELS } from "../constants";
import { LazyImageLightbox } from "./lazy-image-lightbox";

type ZoomableImageProps = {
  src: string;
  alt: string;
  /** next/image `sizes` for the inline image. */
  sizes: string;
  /** Sizing/shape of the frame, e.g. `aspect-video w-full rounded-lg`. */
  className?: string;
};

/** An inline image that opens full screen with zoom (pinch, wheel, double-tap) when clicked. */
export function ZoomableImage({ src, alt, sizes, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${IMAGE_UPLOAD_LABELS.view}: ${alt}`}
        className={cn(
          "group relative block cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-accent",
          className,
        )}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        <span className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
          <ZoomIn aria-hidden className="size-4" />
        </span>
      </button>
      {open && <LazyImageLightbox slides={[{ src, alt }]} index={0} onClose={() => setOpen(false)} />}
    </>
  );
}
