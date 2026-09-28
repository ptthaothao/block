// DTOs for categories ("chủ đề" in the UI), tags and authors as discovery
// entry points. Only public fields leave the server.

export type TopicChild = { slug: string; name: string; postCount: number };

export type TopicSummary = {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  postCount: number;
  children: TopicChild[];
};

/** A topic page: the topic itself plus its top-level family for the sub-topic chips. */
export type TopicPage = {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  postCount: number;
  parent: { slug: string; name: string } | null;
  /** The top-level topic this one belongs to (itself when it is top-level). */
  root: TopicSummary;
};

export type TagSummary = { slug: string; name: string; postCount: number };

export type AuthorOption = { username: string; displayName: string; avatarUrl: string | null; postCount: number };
