import { Suspense } from "react"
import { fetchCustomers, fetchDashboardAnalytics } from "@/lib/dashboard/queries"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TableSkeleton } from "@/components/dashboard/loading-skeleton"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomersClient } from "./customers-client"

export default async function CustomersPage() {
  const [customers, analytics] = await Promise.all([
    fetchCustomers(),
    fetchDashboardAnalytics()
  ])

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Customer Intelligence" 
        description="Understand your audience and track loyalty trends."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <DashboardChart 
              title="Customer Acquisition" 
              description="New signups over the last 6 months"
              data={analytics.customerGrowth}
              index="month"
              categories={["customers"]}
              colors={["#3b82f6"]}
            />
          </Suspense>
        </div>
        <div className="space-y-6">
          <StatsCard 
            title="Total Customers" 
            value={customers.length.toString()}
            delta="+18% this month"
            status="success"
          />
          <StatsCard 
            title="Retention Rate" 
            value="84.2%"
            delta="+2.4%"
            status="success"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Customer Directory</h2>
        <Suspense fallback={<TableSkeleton />}>
          <CustomersClient customers={customers} />
        </Suspense>
      </div>
    </div>
  )
}
