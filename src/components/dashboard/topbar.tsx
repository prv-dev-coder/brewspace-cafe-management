"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import type { DashboardUser } from "@/components/dashboard/types"

type TopbarProps = {
  user: DashboardUser
  onOpenMobileNav: () => void
}

export function Topbar({ user, onOpenMobileNav }: TopbarProps) {
  return (
    <header className="sticky top-3 z-30 flex h-14 items-center justify-between rounded-2xl border border-white/20 bg-white/65 px-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/45 sm:px-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          className="md:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">Cafe Command Center</p>
          <p className="text-xs text-muted-foreground">Premium SaaS dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        <ThemeToggle />
        <ProfileDropdown user={user} />
      </div>
    </header>
  )
}
