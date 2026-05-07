"use client"

// This file is intentionally thin — actual realtime logic lives in
// src/hooks/use-dashboard-realtime.ts which uses the singleton client.
// Re-export for any legacy imports that may reference this path.
export { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"
