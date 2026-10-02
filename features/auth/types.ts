import type { Enums } from "@/types/database";

export type Role = Enums<"user_role">;

/** The signed-in user as the browser may see it. */
export type SessionUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
};

/** What /api/me returns: the session user without internal ids. */
export type PublicSessionUser = Omit<SessionUser, "id">;

export type MeResponse = { user: PublicSessionUser | null };

/** The cached /api/me answer, with the auth marker cookie as it was when it was fetched. */
export type SessionQueryData = MeResponse & { marker: string | null };
