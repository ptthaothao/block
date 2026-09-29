export const LOGIN_ERROR_CODES = {
  oauth: "oauth",
  email: "email",
  send: "send",
  rateLimited: "rate_limited",
  callback: "callback",
  callbackExpired: "callback_expired",
  otp: "otp",
  credentials: "credentials",
  password: "password",
  weakPassword: "weak_password",
  resetSend: "reset_send",
  session: "session",
} as const;
export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

/** Floor for a reader's password; Supabase Auth enforces its own minimum server-side too. */
export const PASSWORD_MIN_LENGTH = 8;

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  oauth: "Không kết nối được với GitHub. Thử lại nhé.",
  email: "Email chưa đúng định dạng.",
  send: "Chưa gửi được mã đăng ký. Thử lại sau ít phút.",
  rate_limited: "Đã gửi quá nhiều mã. Vui lòng thử lại sau khoảng một giờ.",
  callback: "Không xác thực được đăng nhập. Thử lại nhé.",
  callback_expired: "Liên kết đăng nhập đã hết hạn hoặc đã được dùng. Vui lòng đăng nhập lại.",
  otp: "Mã không đúng hoặc đã hết hạn. Thử lại nhé.",
  credentials: "Email hoặc mật khẩu chưa đúng.",
  password: `Mật khẩu cần ít nhất ${PASSWORD_MIN_LENGTH} ký tự.`,
  weak_password: "Mật khẩu này chưa đủ mạnh, thử mật khẩu khác nhé.",
  reset_send: "Chưa gửi được liên kết đặt lại mật khẩu. Thử lại sau ít phút.",
  session: "Phiên đặt mật khẩu đã hết hạn. Vui lòng thử lại từ đầu.",
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

/** 303 so a POST (sign-out form) is followed by a GET. */
export const SEE_OTHER = 303;

/** `name` attributes of the login, registration and password forms. */
export const LOGIN_FORM_FIELDS = {
  email: "email",
  next: "next",
  token: "token",
  password: "password",
} as const;

/** Higher rank includes every permission of the ranks below it. */
export const ROLE_RANK = { reader: 0, author: 1, editor: 2, admin: 3 } as const;

/** TanStack Query key for the signed-in user, shared by every widget that needs it. */
export const SESSION_QUERY_KEY = ["session", "me"] as const;

/** The session is refetched on tab focus; within this window a cached answer is reused. */
export const SESSION_STALE_TIME_MS = 60_000;

export const USER_NAV_COPY = {
  signIn: "Đăng nhập",
  signOut: "Đăng xuất",
  interests: "Quan tâm của tôi",
  dashboard: "Bảng điều khiển",
  menuLabel: (name: string) => `Tài khoản của ${name}`,
} as const;

/** An account created this recently is new: after its first sign-in it lands on onboarding. */
export const NEW_ACCOUNT_WINDOW_MS = 10 * 60_000;

export const LOGIN_MODAL_COPY = {
  title: (site: string) => `Đăng nhập ${site}`,
  defaultReason: "Đăng nhập để thả reaction, bình luận và lưu chủ đề bạn quan tâm.",
  resumeHint: "Đăng nhập xong bạn sẽ quay lại đúng chỗ này, việc đang làm dở được hoàn tất giúp bạn.",
} as const;

/** Copy for the /login and /set-password, /forgot-password pages. */
export const LOGIN_COPY = {
  signInTab: "Đăng nhập",
  signUpTab: "Đăng ký",
  tabsLabel: "Đăng nhập hoặc đăng ký",
  emailLabel: "Email",
  passwordLabel: "Mật khẩu",
  passwordPlaceholder: "Nhập mật khẩu",
  newPasswordLabel: "Mật khẩu mới",
  newPasswordPlaceholder: "Ít nhất 8 ký tự",
  signInSubmit: "Đăng nhập",
  signUpSubmit: "Gửi mã đăng ký",
  forgotPassword: "Quên mật khẩu?",
  setPasswordSubmit: "Lưu mật khẩu",
  setPasswordTitle: "Đặt mật khẩu",
  setPasswordHint: "Đặt mật khẩu để lần sau đăng nhập không cần chờ email nữa.",
  forgotPasswordTitle: "Quên mật khẩu",
  forgotPasswordHint: "Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.",
  forgotPasswordSubmit: "Gửi liên kết đặt lại",
  resetSent: "Đã gửi liên kết đặt lại mật khẩu. Kiểm tra hộp thư nhé.",
} as const;
