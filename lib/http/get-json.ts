import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";

/** Browser-side GET against our own API (BFF). Throws the server's message on failure. */
export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store", ...init });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? COMMON_ERROR_MESSAGES.unknown);
  }
  return res.json() as Promise<T>;
}
