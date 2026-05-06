import {
  BookOpenText,
  ClipboardList,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react"
import type { NavSection } from "@/components/dashboard/types"

export const dashboardNavigation: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Orders", href: "/dashboard/orders", icon: ClipboardList, badge: "12" },
      { title: "Menu", href: "/dashboard/menu", icon: BookOpenText },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Inventory", href: "/dashboard/inventory", icon: Package },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      { title: "Billing", href: "/dashboard/billing", icon: ReceiptText },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]
