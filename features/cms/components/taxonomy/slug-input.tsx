import { TAXONOMY_COPY } from "../../constants";
import { CountedLabel } from "./counted-label";

type SlugInputProps = {
  id: string;
  label: string;
  /** Path shown before the slug, e.g. "/topics/". */
  prefix: string;
  value: string;
  onChange: (value: string) => void;
  onAuto: () => void;
};

/** Slug field with its public path prefix and a "generate from name" action. */
export function SlugInput({ id, label, prefix, value, onChange, onAuto }: SlugInputProps) {
  return (
    <div>
      <CountedLabel
        htmlFor={id}
        action={
          <button type="button" onClick={onAuto} className="text-xs font-medium text-accent transition hover:text-accent-hover">
            {TAXONOMY_COPY.autoSlug}
          </button>
        }
      >
        {label}
      </CountedLabel>
      <div className="flex overflow-hidden rounded-md border border-border bg-surface-sunken focus-within:border-accent">
        <span className="flex items-center border-r border-border px-3 font-mono text-sm text-faint">{prefix}</span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-text focus:outline-none"
        />
      </div>
    </div>
  );
}
