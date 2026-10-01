"use client";

import { useRef, useState, type DragEvent } from "react";

/**
 * Drag-and-drop of files onto an element. `isDragging` stays true while the
 * pointer moves over children (enter/leave fire per child, so it counts them).
 */
export function useFileDrop(onFiles: (files: File[]) => void, disabled = false) {
  const [isDragging, setIsDragging] = useState(false);
  const depth = useRef(0);

  const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes("Files");

  return {
    isDragging: isDragging && !disabled,
    dropProps: {
      onDragEnter(event: DragEvent) {
        if (disabled || !hasFiles(event)) return;
        event.preventDefault();
        depth.current += 1;
        setIsDragging(true);
      },
      onDragOver(event: DragEvent) {
        if (disabled || !hasFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      },
      onDragLeave() {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setIsDragging(false);
      },
      onDrop(event: DragEvent) {
        event.preventDefault();
        depth.current = 0;
        setIsDragging(false);
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      },
    },
  };
}
