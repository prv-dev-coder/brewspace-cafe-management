"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrowserSupabaseClient } from "@/lib/supabase/client"

/**
 * Subscribes to Supabase Realtime changes for a given table.
 * Uses the singleton browser client to prevent multiple GoTrueClient instances.
 * Calls router.refresh() on any INSERT / UPDATE / DELETE event so that
 * Server Component data is re-fetched automatically.
 */
export function useDashboardRealtime(table: string) {
  const router = useRouter()

  useEffect(() => {
    const supabase = getBrowserSupabaseClient()

    const channel = supabase
      .channel(`db-changes-${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        () => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, router])
}
