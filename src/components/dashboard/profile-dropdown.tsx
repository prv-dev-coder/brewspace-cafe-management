"use client"

import { ChevronDown, LogOut, UserCircle2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/components/dashboard/types"

type ProfileDropdownProps = {
  user: DashboardUser
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Signed out successfully")
    router.push("/login")
    router.refresh()
  }

  const pathname = usePathname()
  const settingsHref = pathname.startsWith("/portal") ? "/portal/settings" : "/dashboard/settings"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-white/20 bg-white/70 px-2.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <Avatar className="size-7 relative overflow-hidden">
            {user.avatar_url && (
              <Image 
                src={user.avatar_url} 
                alt={user.name} 
                fill 
                sizes="28px"
                className="object-cover" 
              />
            )}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium leading-none">{user.name}</p>
            <p className="text-[11px] text-muted-foreground text-capitalize">{user.role}</p>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-xl border-white/20 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90">
        <DropdownMenuLabel>
          <p className="font-medium">{user.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={settingsHref}>
            <UserCircle2 className="size-4" />
            Profile settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={signOut}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
