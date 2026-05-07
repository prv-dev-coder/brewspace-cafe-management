import { Suspense } from "react"
import { fetchInventory } from "@/lib/dashboard/queries"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { StatsSkeleton, TableSkeleton } from "@/components/dashboard/loading-skeleton"
import { InventoryClient } from "./inventory-client"

function getStockStatus(quantity: number, reorderLevel: number) {
  if (quantity <= 0) return "out_of_stock"
  if (quantity <= reorderLevel) return "low_stock"
  return "in_stock"
}

export default async function InventoryPage() {
  const inventory = await fetchInventory()

  const inStock = inventory.filter(
    (i) => getStockStatus(i.quantity, i.reorder_level) === "in_stock"
  ).length
  const lowStock = inventory.filter(
    (i) => getStockStatus(i.quantity, i.reorder_level) === "low_stock"
  ).length
  const outOfStock = inventory.filter(
    (i) => getStockStatus(i.quantity, i.reorder_level) === "out_of_stock"
  ).length

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader
        title="Inventory Tracking"
        description="Monitor stock levels and manage reorder points for essential supplies."
      />

      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total SKUs"
            value={inventory.length.toString()}
            delta={`${inventory.length} unique items`}
            status="neutral"
          />
          <StatsCard
            title="In Stock"
            value={inStock.toString()}
            delta={`${Math.round((inStock / Math.max(inventory.length, 1)) * 100)}% of inventory`}
            status="success"
          />
          <StatsCard
            title="Low Stock"
            value={lowStock.toString()}
            delta={lowStock > 0 ? "Action Required" : "All good"}
            status={lowStock > 0 ? "warning" : "success"}
          />
          <StatsCard
            title="Out of Stock"
            value={outOfStock.toString()}
            delta={outOfStock > 0 ? "Critical" : "All stocked"}
            status={outOfStock > 0 ? "error" : "success"}
          />
        </div>
      </Suspense>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Stock Levels</h2>
        <Suspense fallback={<TableSkeleton />}>
          <InventoryClient inventory={inventory} />
        </Suspense>
      </div>
    </div>
  )
}
