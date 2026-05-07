"use client"

import { Bell } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DashboardNotification } from "@/lib/dashboard/types"

type NotificationsDropdownProps = {
  notifications: DashboardNotification[]
}

export function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  const unreadCount = notifications.filter((notification) => !notification.is_read).length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="relative rounded-xl border-white/20 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-500" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl border-white/20 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90"
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="block space-y-0.5 py-2"
              onSelect={() => toast.info(`${item.title} - ${item.message}`)}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.message}</p>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            No notifications yet
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
