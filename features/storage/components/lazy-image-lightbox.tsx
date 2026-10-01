"use client";

import dynamic from "next/dynamic";

/** ImageLightbox, fetched only when first rendered so the library stays out of page bundles. */
export const LazyImageLightbox = dynamic(() => import("./image-lightbox").then((mod) => mod.ImageLightbox), {
  ssr: false,
});
