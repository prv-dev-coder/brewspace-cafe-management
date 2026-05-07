"use client"

import { Order } from "@/lib/dashboard/types"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { format } from "date-fns"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"

interface OrdersClientProps {
  orders: Order[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  useDashboardRealtime("orders")

  const columns = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (order: Order) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{order.id.slice(0, 8)}
        </span>
      )
    },
    {
      header: "Customer",
      accessorKey: "customer_name",
      cell: (order: Order) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.customer_name || "Guest"}</span>
          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
        </div>
      )
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (order: Order) => format(new Date(order.created_at), "MMM d, h:mm a")
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: (order: Order) => (
        <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (order: Order) => <StatusBadge status={order.status} />
    },
    {
      header: "Payment",
      accessorKey: "payment_status",
      cell: (order: Order) => <StatusBadge status={order.payment_status} />
    }
  ]

  return (
    <DataTable 
      data={orders} 
      columns={columns} 
      searchKey="customer_name"
      placeholder="Filter by customer..."
    />
  )
}
