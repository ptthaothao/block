import { CMS_LIMITS } from "../../../constants";
import type { CmsSeries } from "../../../types";
import { toOptionalNumber } from "../../../utils/post-form";
import { SettingsLabel, SettingsSelect } from "./settings-controls";

const FIELD_IDS = { series: "post-series", position: "post-series-position" } as const;

type SeriesFieldProps = {
  series: CmsSeries[];
  seriesId: number | null;
  position: number | null;
  onSeriesChange: (value: number | null) => void;
  onPositionChange: (value: number | null) => void;
  disabled?: boolean;
};

/** Which series the post belongs to, and its episode number in it. */
export function SeriesField({ series, seriesId, position, onSeriesChange, onPositionChange, disabled }: SeriesFieldProps) {
  return (
    <>
      <SettingsLabel htmlFor={FIELD_IDS.series}>Chuỗi bài viết (Series)</SettingsLabel>
      <div className="grid grid-cols-3 gap-2">
        <SettingsSelect
          id={FIELD_IDS.series}
          small
          wrapperClassName="col-span-2 self-start"
          value={seriesId ?? ""}
          disabled={disabled}
          onChange={(event) => onSeriesChange(toOptionalNumber(event.target.value))}
        >
          <option value="">Không thuộc series</option>
          {series.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </SettingsSelect>
        <label
          htmlFor={FIELD_IDS.position}
          className="flex h-[46px] items-center gap-1 rounded-lg border border-editor-line bg-editor-base px-[11px] focus-within:border-accent has-disabled:opacity-60"
        >
          <span className="text-xs leading-4 text-muted">Tập</span>
          <input
            id={FIELD_IDS.position}
            type="number"
            min={1}
            max={CMS_LIMITS.positionMax}
            value={position ?? ""}
            disabled={disabled || !seriesId}
            onChange={(event) => onPositionChange(toOptionalNumber(event.target.value))}
            className="w-full min-w-0 [appearance:textfield] bg-transparent text-center font-mono text-base leading-6 font-semibold text-text focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>
      </div>
    </>
  );
}
