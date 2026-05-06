import { cache } from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DEFAULT_POST_SIGNOUT_REDIRECT } from "@/lib/auth/config"

export type AppRole = "owner" | "manager" | "staff"

export const getServerSession = cache(async () => {
  const supabase = await createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
})

export const getServerUser = cache(async () => {
  const session = await getServerSession()
  return session?.user ?? null
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