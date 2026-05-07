import type { LucideIcon } from "lucide-react"

export type DashboardUser = {
  name: string
  email: string
  role: "owner" | "manager" | "staff" | "customer"
  avatar_url?: string
}

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export type NavSection = {
  title: string
  items: NavItem[]
}
