import { ImageUrlUpload } from "@/features/storage/components/image-url-upload";
import { ZoomableImage } from "@/features/storage/components/zoomable-image";
import { isAllowedCoverUrl } from "@/lib/utils/cover-image";

import { COVER_IMAGE_STORAGE } from "../../../constants";
import { SettingsLabel, SettingsSection } from "./settings-controls";

const COVER_FIELD_ID = "post-cover";
/** Rendered width of the cover preview inside the 384px sidebar. */
const COVER_PREVIEW_SIZES = "344px";

type CoverFieldProps = { value: string; onChange: (value: string) => void; disabled?: boolean };

/** Cover image uploaded to Supabase Storage, with a 16:9 preview (click to zoom) of how it will be cropped. */
export function CoverField({ value, onChange, disabled }: CoverFieldProps) {
  return (
    <SettingsSection>
      <SettingsLabel htmlFor={COVER_FIELD_ID} meta="16:9 khuyên dùng">
        Ảnh bìa bài viết (Cover Image)
      </SettingsLabel>
      {isAllowedCoverUrl(value) && (
        <ZoomableImage src={value} alt="Ảnh bìa" sizes={COVER_PREVIEW_SIZES} className="aspect-video w-full rounded-lg" />
      )}
      <ImageUrlUpload
        id={COVER_FIELD_ID}
        bucket={COVER_IMAGE_STORAGE.bucket}
        path={COVER_IMAGE_STORAGE.path}
        value={value}
        onChange={onChange}
        disabled={disabled}
        hideDropzoneWhenFull
      />
    </SettingsSection>
  );
}
