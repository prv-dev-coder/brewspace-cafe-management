import { Suspense } from "react"
import { fetchMenuItems, fetchCategories } from "@/lib/dashboard/queries"
import { SectionHeader } from "@/components/dashboard/section-header"
import { GridSkeleton } from "@/components/dashboard/loading-skeleton"
import { MenuClient } from "./menu-client"

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    fetchMenuItems(),
    fetchCategories()
  ])

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Menu Management" 
        description="Organize your cafe's offerings and update prices in real-time."
      />

      <Suspense fallback={<GridSkeleton />}>
        <MenuClient items={items} categories={categories} />
      </Suspense>
    </div>
  )
}
