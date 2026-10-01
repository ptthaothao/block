"use client";

import { useRef } from "react";

import { ROUTES } from "@/config/routes";
import { useToast } from "@/lib/hooks/use-toast";

import { EditorIcon } from "./editor-icon";

type SlugFieldProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  /** Absolute site origin, for the copied link. */
  siteUrl: string;
};

/** The post's slug as an inline, auto-sized input, with edit and copy-link buttons. */
export function SlugField({ value, onChange, readOnly, siteUrl }: SlugFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const editSlug = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(ROUTES.post(value), siteUrl).href);
      toast.show({ message: "Đã sao chép link bài viết.", tone: "success" });
    } catch {
      toast.show({ message: "Không sao chép được link.", tone: "error" });
    }
  };

  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-sm border border-editor-line bg-editor-chip px-[9px] py-[3px] focus-within:border-accent">
      <input
        ref={inputRef}
        aria-label="Slug"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        size={Math.max(value.length, 1)}
        className="min-w-0 bg-transparent font-mono text-xs leading-4 text-accent-hover focus:outline-none"
      />
      {!readOnly && (
        <button
          type="button"
          onClick={editSlug}
          aria-label="Sửa slug"
          title="Sửa slug"
          className="ml-0.5 opacity-80 transition hover:opacity-100"
        >
          <EditorIcon name="pencil" />
        </button>
      )}
      <button
        type="button"
        onClick={() => void copyLink()}
        disabled={!value}
        aria-label="Sao chép link bài viết"
        title="Sao chép link bài viết"
        className="opacity-80 transition hover:opacity-100 disabled:opacity-40"
      >
        <EditorIcon name="copySmall" />
      </button>
    </span>
  );
}
