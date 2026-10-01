import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { EDITOR_ICONS, type EditorIconName } from "../../constants";

/** A decorative icon from the editor design, at its native size. */
export function EditorIcon({ name, className }: { name: EditorIconName; className?: string }) {
  const { src, size } = EDITOR_ICONS[name];
  // SVGs aren't optimized by next/image; serve the file as is.
  return <Image src={src} width={size} height={size} alt="" aria-hidden unoptimized className={cn("shrink-0", className)} />;
}
