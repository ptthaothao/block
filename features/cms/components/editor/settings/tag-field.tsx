"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils/cn";

import { CMS_LIMITS, TAG_CHIP_TONES, TAG_INPUT_JOINER, TAG_INPUT_SEPARATOR } from "../../../constants";
import { addTagNames, parseTagInput } from "../../../utils/tag-names";
import { SettingsLabel } from "./settings-controls";

const TAG_FIELD_ID = "post-tags";

type TagFieldProps = { value: string; onChange: (value: string) => void; disabled?: boolean };

/** Tags as removable chips; typing a comma or Enter turns the draft into a chip. */
export function TagField({ value, onChange, disabled }: TagFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const tags = parseTagInput(value);
  const full = tags.length >= CMS_LIMITS.tagsPerPost;

  const setTags = (next: string[]) => onChange(next.join(TAG_INPUT_JOINER));
  const commit = (text: string) => {
    setDraft("");
    if (text.trim()) setTags(addTagNames(tags, text, CMS_LIMITS.tagsPerPost));
  };
  const remove = (index: number) => setTags(tags.filter((_, i) => i !== index));

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && !draft && tags.length > 0) {
      remove(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <SettingsLabel htmlFor={TAG_FIELD_ID} meta={`${tags.length} / ${CMS_LIMITS.tagsPerPost} thẻ`}>
        Thẻ bài viết (Tags)
      </SettingsLabel>
      <div
        className="flex min-h-[46px] cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-editor-line bg-editor-base p-2 focus-within:border-accent"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-[9px] py-[3px] font-mono text-xs leading-4",
              TAG_CHIP_TONES[index % TAG_CHIP_TONES.length],
            )}
          >
            #{tag}
            {!disabled && (
              <button type="button" onClick={() => remove(index)} aria-label={`Bỏ tag ${tag}`} className="opacity-80 hover:opacity-100">
                ×
              </button>
            )}
          </span>
        ))}
        {!full && !disabled && (
          <input
            ref={inputRef}
            id={TAG_FIELD_ID}
            value={draft}
            onChange={(event) => {
              const text = event.target.value;
              if (text.includes(TAG_INPUT_SEPARATOR)) commit(text);
              else setDraft(text);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => commit(draft)}
            placeholder="+ Thêm tag..."
            className="min-w-24 flex-1 bg-transparent p-1 font-mono text-xs text-text placeholder:text-faint focus:outline-none"
          />
        )}
      </div>
      <p className="text-[11px] leading-[16.5px] text-muted">
        Phân cách bằng dấu phẩy hoặc phím Enter. Tag mới sẽ chờ biên tập viên duyệt.
      </p>
    </div>
  );
}
