/** Every internal path in one place. */
export const ROUTES = {
  home: "/",
  posts: "/posts",
  post: (slug: string) => `/posts/${slug}`,
  topics: "/topics",
  topic: (slug: string) => `/topics/${slug}`,
  tag: (slug: string) => `/tags/${slug}`,
  login: "/login",
  authCallback: "/auth/callback",
  signOut: "/auth/signout",
  dashboard: "/dashboard",
  dashboardPosts: "/dashboard/posts",
  dashboardNewPost: "/dashboard/posts/new",
  dashboardEditPost: (id: string) => `/dashboard/posts/${id}`,
  dashboardReview: "/dashboard/review",
  dashboardTaxonomy: "/dashboard/taxonomy",
  me: "/me",
  apiMe: "/api/me",
} as const;

/** Read endpoints behind the CMS (BFF). Writes go through Server Actions. */
export const CMS_API_ROUTES = {
  posts: "/api/cms/posts",
  post: (id: string) => `/api/cms/posts/${id}`,
  review: "/api/cms/review",
  taxonomy: "/api/cms/taxonomy",
} as const;

/** Anchor id of the topics section on the home page. */
export const TOPICS_SECTION_ID = "chu-de";

/** Routes that need a signed-in user; the proxy redirects to login otherwise. */
export const PROTECTED_ROUTE_PREFIXES = [ROUTES.dashboard, ROUTES.me] as const;

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
} as const;
