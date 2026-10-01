"use client";

import { ImageUp } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { useFileDrop } from "@/lib/hooks/use-file-drop";
import { cn } from "@/lib/utils/cn";

import { IMAGE_UPLOAD_LABELS } from "../constants";

type ImageDropzoneProps = {
  id: string;
  accept: string;
  multiple: boolean;
  /** Shown under the title, e.g. "PNG, JPG tối đa 4 MB". */
  hint: string;
  /** Replaces the hint and blocks picking, e.g. when maxCount is reached. */
  blockedReason: string | null;
  disabled: boolean;
  onFiles: (files: File[]) => void;
};

/** Click-or-drop area with a hidden file input. */
export function ImageDropzone({ id, accept, multiple, hint, blockedReason, disabled, onFiles }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blocked = disabled || blockedReason !== null;
  const { isDragging, dropProps } = useFileDrop(onFiles, blocked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []));
    // Let the same file be picked again after a failure or removal.
    event.target.value = "";
  };

  return (
    <div
      {...dropProps}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border-strong bg-surface-sunken px-4 py-8 text-center transition-colors",
        isDragging && "border-accent bg-accent/10",
        blocked && "opacity-60",
      )}
    >
      <span className="mb-2 grid size-12 place-items-center rounded-lg bg-surface text-muted">
        <ImageUp aria-hidden className="size-6" />
      </span>
      <p className="text-sm font-semibold text-text">
        {isDragging ? IMAGE_UPLOAD_LABELS.dropHere : IMAGE_UPLOAD_LABELS.title}
      </p>
      <p className="text-xs text-faint">{blockedReason ?? hint}</p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={blocked}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
      />
      <Button size="sm" className="mt-3" disabled={blocked} onClick={() => inputRef.current?.click()}>
        {IMAGE_UPLOAD_LABELS.select}
      </Button>
    </div>
  );
}
