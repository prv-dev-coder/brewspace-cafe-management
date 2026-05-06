"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { NavSection } from "@/components/dashboard/types"

type SidebarNavProps = {
  sections: NavSection[]
  collapsed: boolean
  onNavigate?: () => void
}

export function SidebarNav({ sections, collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1.5">
          {!collapsed && (
            <p className="px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
              {section.title}
            </p>
          )}
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex h-10 items-center rounded-xl border border-transparent px-3 text-sm font-medium text-muted-foreground transition-all hover:border-white/20 hover:bg-white/60 hover:text-foreground dark:hover:border-white/10 dark:hover:bg-white/5",
                    collapsed ? "justify-center" : "justify-between gap-2",
                    isActive &&
                      "border-white/25 bg-white/85 text-foreground shadow-sm dark:border-white/15 dark:bg-white/10"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav"
                      className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-blue-500/25"
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="size-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </span>
                  {!collapsed && item.badge && (
                    <Badge variant="secondary" className="relative rounded-full px-2 text-[11px]">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
