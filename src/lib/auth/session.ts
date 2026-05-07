import { cache } from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DEFAULT_POST_SIGNOUT_REDIRECT } from "@/lib/auth/config"

export type AppRole = "owner" | "manager" | "staff"

/**
 * Returns the currently authenticated user from the server.
 * Uses getUser() (JWT-verified) instead of getSession() (not verified server-side).
 * Wrapped in React cache() to deduplicate calls within a single request.
 */
export const getServerUser = cache(async () => {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return user
})

/**
 * @deprecated Use getServerUser() directly.
 * Kept for backward-compat while migrating call-sites.
 */
export const getServerSession = cache(async () => {
  const user = await getServerUser()
  // Return a minimal session-like object so old callers don't break
  return user ? { user } : null
})

export const requireUser = cache(async () => {
  const user = await getServerUser()

  if (!user) {
    redirect(DEFAULT_POST_SIGNOUT_REDIRECT)
  }

  return user
})

export const getUserRole = (
  user: { app_metadata?: Record<string, unknown> } | null
) => {
  const rawRole = user?.app_metadata?.role

  if (
    rawRole === "owner" ||
    rawRole === "manager" ||
    rawRole === "staff"
  ) {
    return rawRole as AppRole
  }

  return null
}