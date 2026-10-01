import Image from "next/image";

import { isAllowedCoverUrl } from "@/lib/utils/cover-image";
import { cn } from "@/lib/utils/cn";

import { IMAGE_THUMB_SIZES } from "../constants";

type ImageThumbProps = { src: string; alt: string; dimmed?: boolean };

/**
 * Square list thumbnail. Local previews (blob:) and URLs outside the
 * configured image hosts skip optimisation instead of crashing next/image.
 */
export function ImageThumb({ src, alt, dimmed }: ImageThumbProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={IMAGE_THUMB_SIZES}
      unoptimized={!isAllowedCoverUrl(src)}
      className={cn("object-cover transition-opacity", dimmed && "opacity-50")}
    />
  );
}
