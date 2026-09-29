/**
 * Something a visitor tried to do (react, comment, follow) before signing in.
 * It is replayed on `postSlug`'s page once they come back signed in.
 */
export type PendingAction<TPayload = unknown> = {
  type: string;
  postSlug: string;
  payload: TPayload;
  createdAt: number;
};
