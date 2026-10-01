/**
 * Raster image types we store, with the extension used for the object name.
 * SVG is left out on purpose: it can carry scripts and is served from a
 * public bucket.
 */
export const IMAGE_MIME_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
} as const;

export type ImageMimeType = keyof typeof IMAGE_MIME_EXTENSIONS;

export const IMAGE_MIME_TYPES = Object.keys(IMAGE_MIME_EXTENSIONS) as ImageMimeType[];

/** Default `accept` for the file picker: every type the server takes. */
export const DEFAULT_IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(",");

/**
 * Hard cap enforced by the upload route. Uploads pass through our server
 * (BFF), and serverless request bodies top out around 4.5MB, so a component
 * `maxSize` above this is still refused server-side.
 */
export const IMAGE_MAX_BYTES = 4 * 1024 * 1024;

/** One folder or bucket name: letters, digits, `-` and `_` (uuids fit). */
export const STORAGE_SEGMENT_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

/** Deepest folder path accepted under a bucket, e.g. `content/<postId>` is 2. */
export const STORAGE_PATH_MAX_DEPTH = 4;

/** Multipart field names shared by the upload route and its browser caller. */
export const IMAGE_UPLOAD_FIELDS = { file: "file", bucket: "bucket", path: "path" } as const;

/** Browser cache lifetime for stored objects; names are unique so they never change. */
export const STORAGE_CACHE_CONTROL_SECONDS = "31536000";

export const STORAGE_ERROR_MESSAGES = {
  notImage: "Chỉ nhận tệp ảnh.",
  typeNotAccepted: "Định dạng ảnh này không được hỗ trợ.",
  tooLarge: (limit: string) => `Ảnh vượt quá dung lượng cho phép (${limit}).`,
  tooMany: (max: number) => `Chỉ được chọn tối đa ${max} ảnh.`,
  invalidTarget: "Vị trí lưu ảnh không hợp lệ.",
  uploadFailed: "Tải ảnh lên thất bại, thử lại nhé.",
  network: "Mất kết nối khi tải ảnh lên, kiểm tra mạng rồi thử lại.",
  deleteFailed: "Không xoá được ảnh khỏi kho lưu trữ.",
} as const;

export const IMAGE_UPLOAD_LABELS = {
  title: "Tải ảnh lên",
  dropHere: "Thả ảnh vào đây",
  select: "Chọn ảnh",
  hint: (types: string, limit: string) => `${types} tối đa ${limit}`,
  limitReached: (max: number) => `Đã đạt tối đa ${max} ảnh`,
  uploading: "Đang tải lên…",
  failed: "Tải lên thất bại",
  retry: "Thử lại",
  remove: "Xoá ảnh",
  view: "Xem ảnh lớn",
} as const;

/** Vietnamese labels for yet-another-react-lightbox's buttons. */
export const LIGHTBOX_LABELS = {
  Close: "Đóng",
  Previous: "Ảnh trước",
  Next: "Ảnh sau",
  "Zoom in": "Phóng to",
  "Zoom out": "Thu nhỏ",
  Lightbox: "Xem ảnh",
  Carousel: "Danh sách ảnh",
} as const;

/** Lightbox zoom: up to 4x the image's own pixels, reached in two double-click/tap stops. */
export const LIGHTBOX_ZOOM = {
  maxZoomPixelRatio: 4,
  zoomInMultiplier: 2,
  doubleClickMaxStops: 2,
  scrollToZoom: true,
} as const;

/** Rendered size of a list thumbnail (size-12). */
export const IMAGE_THUMB_SIZES = "48px";
