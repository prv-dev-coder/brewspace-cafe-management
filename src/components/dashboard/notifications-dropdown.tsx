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

const mockNotifications = [
  { id: "1", title: "Revenue up 18%", detail: "Compared to last week" },
  { id: "2", title: "Low stock alert", detail: "Brazilian roast beans" },
  { id: "3", title: "New customer feedback", detail: "4.9 rating from Priya" },
]

export function NotificationsDropdown() {
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
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl border-white/20 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90"
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className="block space-y-0.5 py-2"
            onSelect={() => toast.info(`${item.title} - ${item.detail}`)}
          >
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
