export const LOGIN_ERROR_CODES = {
  oauth: "oauth",
  email: "email",
  send: "send",
  rateLimited: "rate_limited",
  callback: "callback",
  callbackExpired: "callback_expired",
  otp: "otp",
} as const;
export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  oauth: "Không kết nối được với GitHub. Thử lại nhé.",
  email: "Email chưa đúng định dạng.",
  send: "Chưa gửi được mã đăng nhập. Thử lại sau ít phút.",
  rate_limited: "Đã gửi quá nhiều mã đăng nhập. Vui lòng thử lại sau khoảng một giờ.",
  callback: "Không xác thực được đăng nhập. Thử lại nhé.",
  callback_expired: "Liên kết đăng nhập đã hết hạn hoặc đã được dùng. Vui lòng đăng nhập lại.",
  otp: "Mã không đúng hoặc đã hết hạn. Thử lại nhé.",
};

/** Supabase Auth error codes that mean the email was refused for rate limiting. */
export const EMAIL_RATE_LIMIT_ERROR_CODES: readonly string[] = [
  "over_email_send_rate_limit",
  "over_request_rate_limit",
];

/** Supabase Auth error codes that mean the OAuth/magic-link code is expired or already used. */
export const CALLBACK_EXPIRED_ERROR_CODES: readonly string[] = ["bad_code_verifier", "otp_expired"];

/** Value of the `sent` query param after an OTP code is emailed. */
export const OTP_SENT_FLAG = "1";

/** Number of digits in the email OTP code (must match the Auth setting on the Supabase project — not supabase/config.toml, which only applies to `supabase start` local dev). */
export const OTP_LENGTH = 8;

export const OAUTH_PROVIDER = "github";

/** Responses about the current user must never be cached by a CDN or the browser. */
export const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;

/** 303 so a POST (sign-out form) is followed by a GET. */
export const SEE_OTHER = 303;

/** `name` attributes of the login forms. */
export const LOGIN_FORM_FIELDS = {
  email: "email",
  next: "next",
  token: "token",
} as const;

/** Higher rank includes every permission of the ranks below it. */
export const ROLE_RANK = { reader: 0, author: 1, editor: 2, admin: 3 } as const;
