import "server-only";

import { cookies } from "next/headers";

import { AUTH_MARKER_COOKIE, AUTH_MARKER_MAX_AGE_SECONDS } from "../constants";

/**
 * Rotate the auth marker after a sign-in or sign-out so every open tab sees
 * the change on its next navigation or focus and refetches /api/me once.
 * Call from a Server Action or Route Handler only.
 */
export async function markAuthChanged() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_MARKER_COOKIE, crypto.randomUUID(), {
    path: "/",
    sameSite: "lax",
    // Read by the browser on purpose; the value is random and grants nothing.
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_MARKER_MAX_AGE_SECONDS,
  });
}
