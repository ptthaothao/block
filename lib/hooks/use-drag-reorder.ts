"use client";

import { useState, type DragEvent, type KeyboardEvent } from "react";

/** Put this attribute on the row element so it becomes the drag image. */
export const DRAG_ITEM_ATTRIBUTE = "data-drag-item";

type DragItem<T> = { id: T; group: string };

/**
 * Native drag-and-drop reordering within groups (e.g. siblings): an item can
 * only be dropped on another item of the same group. `handleProps` also lets
 * keyboard users move an item with the arrow keys.
 */
export function useDragReorder<T>(onMove: (group: string, from: T, to: T) => void) {
  const [dragging, setDragging] = useState<DragItem<T> | null>(null);
  const [over, setOver] = useState<T | null>(null);

  const end = () => {
    setDragging(null);
    setOver(null);
  };

  const itemProps = (id: T, group: string) => ({
    [DRAG_ITEM_ATTRIBUTE]: "",
    onDragOver: (event: DragEvent) => {
      if (dragging?.group !== group) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (over !== id) setOver(id);
    },
    onDrop: (event: DragEvent) => {
      if (dragging?.group !== group) return;
      event.preventDefault();
      if (dragging.id !== id) onMove(group, dragging.id, id);
      end();
    },
  });

  /** Props for the drag handle; `siblings` are the group's ids in order, for arrow-key moves. */
  const handleProps = (id: T, group: string, siblings: readonly T[]) => ({
    draggable: true,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.effectAllowed = "move";
      // Drag the whole row, not just the handle.
      const row = (event.currentTarget as HTMLElement).closest<HTMLElement>(`[${DRAG_ITEM_ATTRIBUTE}]`);
      if (row) event.dataTransfer.setDragImage(row, 0, 0);
      setDragging({ id, group });
    },
    onDragEnd: end,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      const target = siblings[siblings.indexOf(id) + (event.key === "ArrowUp" ? -1 : 1)];
      if (target !== undefined) onMove(group, id, target);
    },
  });

  return {
    itemProps,
    handleProps,
    isDragging: (id: T) => dragging?.id === id,
    isOver: (id: T) => over === id && dragging !== null && dragging.id !== id,
  };
}
