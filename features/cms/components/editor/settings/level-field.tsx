import { POST_LEVEL_OPTIONS } from "../../../constants";
import type { PostLevel } from "../../../types";

type LevelFieldProps = { value: PostLevel; onChange: (value: PostLevel) => void; disabled?: boolean };

/** Reader level as a segmented control (native radios underneath, for keyboard and screen readers). */
export function LevelField({ value, onChange, disabled }: LevelFieldProps) {
  return (
    <fieldset className="flex flex-col gap-1.5" disabled={disabled}>
      <legend className="mb-1.5 text-xs leading-4 font-semibold text-text">Cấp độ độc giả</legend>
      <div className="flex gap-1 rounded-lg border border-editor-line bg-editor-base p-[5px]">
        {POST_LEVEL_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex-1 cursor-pointer rounded-sm py-1.5 text-center text-xs leading-4 text-muted transition hover:text-text has-checked:bg-accent-strong has-checked:font-medium has-checked:text-white has-checked:shadow-xs has-focus-visible:outline-2 has-focus-visible:outline-accent has-disabled:cursor-default has-disabled:opacity-60"
          >
            <input
              type="radio"
              name="post-level"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
