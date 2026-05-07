"use client"

import { Profile } from "@/lib/dashboard/types"
import { DataTable } from "@/components/dashboard/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"

interface CustomersClientProps {
  customers: Profile[]
}

export function CustomersClient({ customers }: CustomersClientProps) {
  useDashboardRealtime("profiles")

  const columns = [
    {
      header: "Customer",
      accessorKey: "full_name",
      cell: (p: Profile) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarImage src={p.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {(p.full_name || p.email || "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{p.full_name || "Anonymous"}</span>
            <span className="text-xs text-muted-foreground">{p.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Joined",
      accessorKey: "created_at",
      cell: (p: Profile) => format(new Date(p.created_at), "MMM d, yyyy")
    },
    {
      header: "Status",
      accessorKey: "role",
      cell: () => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Active
        </span>
      )
    },
    {
      header: "Total Orders",
      accessorKey: "id",
      cell: () => <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
    }
  ]

  return (
    <DataTable 
      data={customers} 
      columns={columns} 
      searchKey="full_name"
      placeholder="Search customers..."
    />
  )
}
