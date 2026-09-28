/**
 * Environment variable names. None use NEXT_PUBLIC_, so values are never
 * bundled into browser JavaScript (BFF: the browser never talks to Supabase).
 */
export const ENV_KEYS = {
  supabaseUrl: "SUPABASE_URL",
  supabasePublishableKey: "SUPABASE_PUBLISHABLE_KEY",
  /** Legacy name, still accepted. */
  supabaseAnonKey: "SUPABASE_ANON_KEY",
  siteUrl: "SITE_URL",
  /** Set by Vercel on every deployment: production domain, without protocol. */
  vercelProductionUrl: "VERCEL_PROJECT_PRODUCTION_URL",
} as const;

export const DEFAULT_SITE_URL = "http://localhost:3000";

const HTTPS_PREFIX = "https://";

/**
 * Public origin used for auth redirects and metadata: SITE_URL when set,
 * otherwise the Vercel production domain, otherwise localhost for dev.
 */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const explicit = env[ENV_KEYS.siteUrl];
  if (explicit) return explicit;
  const vercelHost = env[ENV_KEYS.vercelProductionUrl];
  if (vercelHost) return `${HTTPS_PREFIX}${vercelHost}`;
  return DEFAULT_SITE_URL;
}

type SupabaseEnv = { url: string; key: string };

/** Shared by lib/env.ts (server code) and the proxy, which can't import server-only. */
export function readSupabaseEnv(env: NodeJS.ProcessEnv = process.env): SupabaseEnv | null {
  const url = env[ENV_KEYS.supabaseUrl];
  const key = env[ENV_KEYS.supabasePublishableKey] ?? env[ENV_KEYS.supabaseAnonKey];
  return url && key ? { url, key } : null;
}
