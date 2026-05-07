import { PortalEmptyState } from "@/components/portal/empty-states"
import { GlassCard } from "@/components/portal/glass-card"

export default function OrdersPage() {
  // Placeholder for real data fetch
  const orders: any[] = []

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-1">View and reorder your past purchases.</p>
      </div>

      {orders.length === 0 ? (
        <PortalEmptyState 
          title="No orders yet" 
          description="You haven't placed any orders yet. Once you do, they will appear here." 
          icon="package" 
        />
      ) : (
        <div className="grid gap-4">
          {/* Order list mapping would go here */}
        </div>
      )}
    </div>
  )
}
