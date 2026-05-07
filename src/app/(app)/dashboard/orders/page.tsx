import { Suspense } from "react"
import { fetchOrders, fetchDashboardAnalytics } from "@/lib/dashboard/queries"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { StatsSkeleton, TableSkeleton } from "@/components/dashboard/loading-skeleton"
import { OrdersClient } from "./orders-client"

export default async function OrdersPage() {
  const [orders, analytics] = await Promise.all([
    fetchOrders(),
    fetchDashboardAnalytics()
  ])

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Orders" 
        description="Manage and track your cafe's sales in real-time."
      />

      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analytics.revenueCards.slice(0, 2).map((card, i) => (
            <StatsCard key={i} {...card} />
          ))}
          <StatsCard 
            title="Avg. Order Value" 
            value={`$${(orders.reduce((s, o) => s + o.total_amount, 0) / (orders.length || 1)).toFixed(2)}`}
            delta="+5%"
            status="neutral"
          />
          <StatsCard 
            title="Total Items Sold" 
            value={orders.reduce((s, o) => s + (o.items?.length || 0), 0).toString()}
            delta="+12%"
            status="success"
          />
        </div>
      </Suspense>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Transactions</h2>
        <Suspense fallback={<TableSkeleton />}>
          <OrdersClient orders={orders} />
        </Suspense>
      </div>
    </div>
  )
}
