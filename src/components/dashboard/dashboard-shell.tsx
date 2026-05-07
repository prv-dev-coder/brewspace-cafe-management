"use client"

import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { dashboardNavigation } from "@/components/dashboard/navigation"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/topbar"
import type { DashboardUser } from "@/components/dashboard/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { DashboardNotification } from "@/lib/dashboard/types"

type DashboardShellProps = {
  user: DashboardUser
  notifications: DashboardNotification[]
  children: React.ReactNode
}

export function DashboardShell({ user, notifications, children }: DashboardShellProps) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("dashboard:sidebar-collapsed")
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarCollapsed(stored === "1")
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("dashboard:sidebar-collapsed", isSidebarCollapsed ? "1" : "0")
  }, [isSidebarCollapsed])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.16),transparent_30%)]" />
      <div className="relative mx-auto flex w-full max-w-[1600px] gap-3 p-3 md:p-4">
        <motion.aside
          animate={{ width: isSidebarCollapsed ? 92 : 280 }}
          className={cn(
            "hidden h-[calc(100vh-2rem)] flex-col rounded-3xl border border-white/20 bg-white/60 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 md:flex"
          )}
        >
          <div className="mb-3 flex items-center justify-between rounded-2xl px-2 py-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-300">
                <Sparkles className="size-4" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <p className="text-sm font-semibold">Brewspace</p>
                  <p className="text-xs text-muted-foreground">Control panel</p>
                </div>
              )}
            </div>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </Button>
          </div>

          <SidebarNav sections={dashboardNavigation} collapsed={isSidebarCollapsed} />
        </motion.aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[86%] border-white/20 bg-white/85 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75"
          >
            <SheetHeader className="px-2">
              <SheetTitle className="text-left">Brewspace Navigation</SheetTitle>
              <SheetDescription className="text-left">
                Navigate across your cafe operations workspace.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <SidebarNav sections={dashboardNavigation} collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex min-h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col gap-3">
          <Topbar user={user} notifications={notifications} onOpenMobileNav={() => setMobileOpen(true)} />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex-1 rounded-3xl border border-white/20 bg-white/65 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 sm:p-6"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
