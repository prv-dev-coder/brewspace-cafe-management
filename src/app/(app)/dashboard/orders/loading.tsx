import { SectionHeader } from "@/components/dashboard/section-header"
import { StatsSkeleton, TableSkeleton } from "@/components/dashboard/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Orders" 
        description="Manage and track your cafe's sales in real-time."
      />
      <StatsSkeleton />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <TableSkeleton />
      </div>
    </div>
  )
}
