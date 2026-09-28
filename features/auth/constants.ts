export const LOGIN_ERROR_CODES = {
  oauth: "oauth",
  email: "email",
  send: "send",
  rateLimit: "rate_limit",
  callback: "callback",
} as const;
export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  oauth: "Không kết nối được với GitHub. Thử lại nhé.",
  email: "Email chưa đúng định dạng.",
  send: "Chưa gửi được email đăng nhập. Thử lại sau ít phút.",
  rate_limit: "Email đăng nhập vừa được gửi. Kiểm tra hộp thư (cả mục Spam) hoặc đợi khoảng 1 phút rồi thử lại.",
  callback: "Liên kết đăng nhập đã hết hạn hoặc không hợp lệ.",
};

/** Value of the `sent` query param after a magic link is emailed. */
export const MAGIC_LINK_SENT_FLAG = "1";

export const OAUTH_PROVIDER = "github";

/** Supabase Auth error code when the same email asks for a link too often. */
export const EMAIL_RATE_LIMIT_ERROR_CODE = "over_email_send_rate_limit";

/** Responses about the current user must never be cached by a CDN or the browser. */
export const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" } as const;

/** 303 so a POST (sign-out form) is followed by a GET. */
export const SEE_OTHER = 303;

/** `name` attributes of the login forms. */
export const LOGIN_FORM_FIELDS = {
  email: "email",
  next: "next",
} as const;

/** Higher rank includes every permission of the ranks below it. */
export const ROLE_RANK = { reader: 0, author: 1, editor: 2, admin: 3 } as const;
