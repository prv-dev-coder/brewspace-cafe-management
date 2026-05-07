"use client"

import * as React from "react"
import { Reservation } from "@/lib/dashboard/types"
import { DataTable } from "@/components/dashboard/data-table"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon, CheckCircle2Icon, XCircleIcon, ClockIcon, CalendarIcon, UsersIcon } from "lucide-react"
import { updateReservationStatus } from "@/lib/dashboard/actions"
import { toast } from "sonner"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { format } from "date-fns"

interface ReservationClientProps {
  reservations: Reservation[]
}

export function ReservationClient({ reservations }: ReservationClientProps) {
  useDashboardRealtime("reservations")

  const columns = [
    {
      header: "Guest",
      accessorKey: "customer_name",
      cell: (res: Reservation) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{res.customer_name}</span>
          <span className="text-xs text-muted-foreground">{res.customer_email}</span>
        </div>
      )
    },
    {
      header: "Schedule",
      accessorKey: "reservation_time",
      cell: (res: Reservation) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="h-3 w-3 text-primary" />
            {format(new Date(res.reservation_time), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            {format(new Date(res.reservation_time), "h:mm a")}
          </div>
        </div>
      )
    },
    {
      header: "Guests",
      accessorKey: "guest_count",
      cell: (res: Reservation) => (
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{res.guest_count}</span>
        </div>
      )
    },
    {
      header: "Table",
      accessorKey: "table_number",
      cell: (res: Reservation) => (
        <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-mono">
          T-{res.table_number || "--"}
        </span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (res: Reservation) => <StatusBadge status={res.status} />
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (res: Reservation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="gap-2 cursor-pointer text-emerald-500 focus:text-emerald-500"
              onClick={() => handleStatusUpdate(res.id, "confirmed")}
            >
              <CheckCircle2Icon className="h-4 w-4" /> Confirm
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 cursor-pointer text-amber-500 focus:text-amber-500"
              onClick={() => handleStatusUpdate(res.id, "pending")}
            >
              <ClockIcon className="h-4 w-4" /> Set Pending
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 cursor-pointer text-rose-500 focus:text-rose-500"
              onClick={() => handleStatusUpdate(res.id, "cancelled")}
            >
              <XCircleIcon className="h-4 w-4" /> Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateReservationStatus(id, status)
      toast.success(`Reservation ${status}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <DataTable 
      data={reservations} 
      columns={columns} 
      searchKey="customer_name"
      placeholder="Search by guest name..."
    />
  )
}
