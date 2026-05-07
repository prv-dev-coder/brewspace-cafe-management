"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function DashboardRealtimeBridge() {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const scheduleRefresh = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => router.refresh(), 350)
    }

    const channel = supabase
      .channel("dashboard-live-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, scheduleRefresh)
      .subscribe()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      void supabase.removeChannel(channel)
    }
  }, [router, supabase])

  return null
}
