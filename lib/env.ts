import "server-only";

import { ENV_KEYS, readSupabaseEnv, resolveSiteUrl } from "./env-keys";

export function getSupabaseEnv() {
  return readSupabaseEnv();
}

export function requireSupabaseEnv() {
  const env = readSupabaseEnv();
  if (!env) {
    throw new Error(`Missing ${ENV_KEYS.supabaseUrl} or ${ENV_KEYS.supabasePublishableKey}. See .env.example.`);
  }
  return env;
}

export const siteUrl = resolveSiteUrl();
