/** Every internal path in one place. */
export const ROUTES = {
  home: "/",
  posts: "/posts",
  post: (slug: string) => `/posts/${slug}`,
  topics: "/topics",
  topic: (slug: string) => `/topics/${slug}`,
  tag: (slug: string) => `/tags/${slug}`,
  login: "/login",
  setPassword: "/set-password",
  forgotPassword: "/forgot-password",
  authCallback: "/auth/callback",
  signOut: "/auth/signout",
  cms: "/cms",
  cmsPosts: "/cms/posts",
  cmsNewPost: "/cms/posts/new",
  cmsEditPost: (id: string) => `/cms/posts/${id}`,
  cmsReview: "/cms/review",
  cmsTaxonomy: "/cms/taxonomy",
  cmsModeration: "/cms/moderation",
  me: "/me",
  meInterests: "/me/interests",
  onboarding: "/onboarding",
  apiMe: "/api/me",
} as const;

/** Public read endpoints for client widgets (BFF). */
export const API_ROUTES = {
  feed: "/api/feed",
  interests: "/api/interests",
  postReactions: (slug: string) => `/api/posts/${slug}/reactions`,
  postReactionPeople: (slug: string, emoji: string) => `/api/posts/${slug}/reactions/${emoji}/people`,
  postComments: (slug: string) => `/api/posts/${slug}/comments`,
  commentReplies: (id: string) => `/api/comments/${id}/replies`,
  /** POST multipart: the one write that is a route, since Server Actions run one at a time and cap bodies at 1MB. */
  storageImages: "/api/storage/images",
} as const;

/** Read endpoints behind the CMS (BFF). Writes go through Server Actions. */
export const CMS_API_ROUTES = {
  posts: "/api/cms/posts",
  post: (id: string) => `/api/cms/posts/${id}`,
  review: "/api/cms/review",
  taxonomy: "/api/cms/taxonomy",
  moderation: "/api/cms/moderation",
} as const;

/** Anchor id of the topics section on the home page. */
export const TOPICS_SECTION_ID = "chu-de";

/** Routes that need a signed-in user; the proxy redirects to login otherwise. */
export const PROTECTED_ROUTE_PREFIXES = [ROUTES.cms, ROUTES.me] as const;

/** Query-string keys shared by login, callback and proxy. */
export const QUERY_PARAMS = {
  next: "next",
  error: "error",
  sent: "sent",
  code: "code",
  status: "status",
  email: "email",
  offset: "offset",
  page: "page",
  topic: "topic",
  tag: "tag",
  level: "level",
  author: "author",
  commentSort: "comments",
} as const;
