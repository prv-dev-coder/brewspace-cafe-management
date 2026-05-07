"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  PlusIcon,
  Edit2Icon,
  Trash2Icon,
  MoreHorizontalIcon,
  AlertTriangleIcon,
  PackageIcon,
} from "lucide-react"

import { InventoryItem } from "@/lib/dashboard/types"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"
import { deleteInventoryItem } from "@/lib/dashboard/actions"
import { InventoryDialog } from "@/components/forms/inventory-dialog"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ─── Props ────────────────────────────────────────────────────────────────────

interface InventoryClientProps {
  inventory: InventoryItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStockStatus(item: InventoryItem): "in_stock" | "low_stock" | "out_of_stock" {
  if (item.quantity <= 0) return "out_of_stock"
  if (item.quantity <= item.reorder_level) return "low_stock"
  return "in_stock"
}

function getStockPercent(item: InventoryItem): number {
  const max = Math.max(item.reorder_level * 3, item.quantity, 1)
  return Math.min(Math.round((item.quantity / max) * 100), 100)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryClient({ inventory }: InventoryClientProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingItem, setDeletingItem] = React.useState<InventoryItem | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  useDashboardRealtime("inventory")

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const openDelete = (item: InventoryItem) => {
    setDeletingItem(item)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    setIsDeleting(true)
    try {
      const result = await deleteInventoryItem(deletingItem.id)
      if (result.success) {
        toast.success(`"${deletingItem.item_name}" removed from inventory`)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to remove item")
    } finally {
      setIsDeleting(false)
      setDeleteOpen(false)
      setDeletingItem(null)
    }
  }

  // ─── Columns ─────────────────────────────────────────────────────────────────

  const columns = [
    {
      header: "Item Name",
      accessorKey: "item_name",
      cell: (item: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <PackageIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium text-foreground block">{item.item_name}</span>
            {item.category && (
              <span className="text-xs text-muted-foreground">{item.category}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Stock Level",
      accessorKey: "quantity",
      cell: (item: InventoryItem) => {
        const pct = getStockPercent(item)
        const status = getStockStatus(item)
        return (
          <div className="space-y-1.5 min-w-[140px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">
                {item.quantity} <span className="font-normal text-muted-foreground">{item.unit}</span>
              </span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <Progress
              value={pct}
              className="h-1.5"
              style={{
                ["--progress-color" as string]:
                  status === "out_of_stock"
                    ? "hsl(var(--destructive))"
                    : status === "low_stock"
                    ? "hsl(45 93% 47%)"
                    : "hsl(142 76% 36%)",
              }}
            />
          </div>
        )
      },
    },
    {
      header: "Reorder At",
      accessorKey: "reorder_level",
      cell: (item: InventoryItem) => (
        <span className="text-muted-foreground text-sm">
          {item.reorder_level} {item.unit}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: InventoryItem) => {
        const status = getStockStatus(item)
        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {status === "low_stock" && (
              <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
            )}
          </div>
        )
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: InventoryItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => openEdit(item)}
            >
              <Edit2Icon className="h-4 w-4" />
              Edit Stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={() => openDelete(item)}
            >
              <Trash2Icon className="h-4 w-4" />
              Remove Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {inventory.filter((i) => getStockStatus(i) === "in_stock").length} In Stock
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {inventory.filter((i) => getStockStatus(i) === "low_stock").length} Low
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            {inventory.filter((i) => getStockStatus(i) === "out_of_stock").length} Out of Stock
          </Badge>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Supply
        </Button>
      </div>

      {inventory.length > 0 ? (
        <DataTable
          data={inventory}
          columns={columns}
          searchKey="item_name"
          placeholder="Search supplies…"
        />
      ) : (
        <EmptyState
          title="No inventory items"
          description="Add your first supply item to start tracking stock levels."
          actionLabel="Add Supply"
          onAction={openAdd}
          icon={<PackageIcon className="h-12 w-12" />}
        />
      )}

      {/* Add/Edit Dialog */}
      <InventoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
      />

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove &quot;{deletingItem?.item_name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from your inventory records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {isDeleting ? "Removing…" : "Remove Item"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
