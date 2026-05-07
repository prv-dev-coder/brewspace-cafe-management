"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CoffeeIcon, MenuIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { DashboardUser } from "@/components/dashboard/types"
import type { DashboardNotification } from "@/lib/dashboard/types"

const NAV_LINKS = [
  { href: "/portal", label: "Overview" },
  { href: "/portal/orders", label: "Orders" },
  { href: "/portal/reservations", label: "Reservations" },
  { href: "/portal/favorites", label: "Favorites" },
]

interface PortalNavProps {
  user: DashboardUser
  notifications: DashboardNotification[]
}

export function PortalNav({ user, notifications }: PortalNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-2xl transition-all duration-300">
      <div className="container flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/portal" className="flex items-center gap-2 group relative z-50">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <CoffeeIcon className="size-4" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              BrewSpace
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/portal")
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-all duration-300 hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="portal-nav-indicator"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_-4px_10px_rgba(var(--primary),0.3)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 relative z-50">
          <div className="hidden sm:flex items-center gap-3">
            <NotificationsDropdown notifications={notifications} />
            <ProfileDropdown user={user} />
          </div>

          <div className="flex sm:hidden items-center gap-2">
             <NotificationsDropdown notifications={notifications} />
             <ProfileDropdown user={user} />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-primary/10 transition-colors">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-background/95 backdrop-blur-xl p-0">
              <SheetHeader className="p-6 border-b border-white/5">
                <SheetTitle className="text-left flex items-center gap-2">
                   <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <CoffeeIcon className="size-4" />
                   </div>
                   BrewSpace Portal
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/portal")
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      {link.label}
                      {isActive && <div className="size-1.5 rounded-full bg-primary" />}
                    </Link>
                  )
                })}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-black/5">
                 <p className="text-xs text-muted-foreground text-center">
                   Logged in as <span className="text-foreground font-medium">{user.email}</span>
                 </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
