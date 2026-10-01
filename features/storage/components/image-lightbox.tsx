"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { LIGHTBOX_LABELS, LIGHTBOX_ZOOM } from "../constants";

type ImageLightboxProps = {
  slides: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
};

/**
 * Full-screen viewer with zoom (buttons, wheel, pinch, double-tap) and
 * swipe/arrow navigation. Loaded on demand (see ImageUpload), so the library
 * never ships until someone opens an image.
 */
export function ImageLightbox({ slides, index, onClose }: ImageLightboxProps) {
  const single = slides.length <= 1;
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      slides={slides}
      plugins={[Zoom]}
      labels={LIGHTBOX_LABELS}
      zoom={LIGHTBOX_ZOOM}
      carousel={{ finite: single }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      render={single ? { buttonPrev: () => null, buttonNext: () => null } : undefined}
    />
  );
}
