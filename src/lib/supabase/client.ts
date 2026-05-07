import { createBrowserClient } from "@supabase/ssr"

// ─── Singleton browser Supabase client ───────────────────────────────────────
// Using module-level variable ensures only ONE GoTrueClient instance is created
// per browser page lifetime, which prevents the "Multiple GoTrueClient detected"
// console warning.

let _client: ReturnType<typeof createBrowserClient> | undefined

export function getBrowserSupabaseClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

/**
 * @deprecated Use getBrowserSupabaseClient() to get the singleton.
 * This alias exists for backward compatibility with existing auth components.
 */
export function createBrowserSupabaseClient() {
  return getBrowserSupabaseClient()
}