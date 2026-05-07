"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  PlusIcon,
  SearchIcon,
  LayoutGridIcon,
  Edit2Icon,
  Trash2Icon,
  MoreVerticalIcon,
  ImageIcon,
  TagIcon,
} from "lucide-react"

import { MenuItem, Category } from "@/lib/dashboard/types"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"
import { deleteMenuItem, deleteCategory } from "@/lib/dashboard/actions"
import { MenuItemDialog } from "@/components/forms/menu-item-dialog"
import { CategoryDialog } from "@/components/forms/category-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { StatusBadge } from "@/components/dashboard/status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"

// ─── AlertDialog Component ────────────────────────────────────────────────────
// (Inline since shadcn alert-dialog may not exist; we create a simple confirm)

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  itemName: string
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{itemName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the item from your menu. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MenuClientProps {
  items: MenuItem[]
  categories: Category[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MenuClient({ items, categories }: MenuClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null)

  // Delete confirm state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingItem, setDeletingItem] = React.useState<MenuItem | null>(null)

  // Category Dialog state
  const [catDialogOpen, setCatDialogOpen] = React.useState(false)
  const [editingCat, setEditingCat] = React.useState<Category | null>(null)

  // Category Delete state
  const [catDeleteOpen, setCatDeleteOpen] = React.useState(false)
  const [deletingCat, setDeletingCat] = React.useState<Category | null>(null)

  // Realtime updates
  useDashboardRealtime("menu_items")

  // ─── Derived State ───────────────────────────────────────────────────────────

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.category_id === selectedCategory
        : true
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [items, selectedCategory, searchQuery])

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const openDelete = (item: MenuItem) => {
    setDeletingItem(item)
    setDeleteOpen(true)
  }

  const openCatAdd = () => {
    setEditingCat(null)
    setCatDialogOpen(true)
  }

  const openCatEdit = (cat: Category) => {
    setEditingCat(cat)
    setCatDialogOpen(true)
  }

  const openCatDelete = (cat: Category) => {
    setDeletingCat(cat)
    setCatDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    try {
      const result = await deleteMenuItem(deletingItem.id)
      if (result.success) {
        toast.success(`"${deletingItem.name}" deleted`)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to delete item")
    } finally {
      setDeleteOpen(false)
      setDeletingItem(null)
    }
  }

  const handleCatDelete = async () => {
    if (!deletingCat) return
    try {
      const result = await deleteCategory(deletingCat.id)
      if (result.success) {
        toast.success(`"${deletingCat.name}" deleted`)
        if (selectedCategory === deletingCat.id) setSelectedCategory(null)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to delete category")
    } finally {
      setCatDeleteOpen(false)
      setDeletingCat(null)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Search + Filters + Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All
            <Badge variant="secondary" className="ml-1.5 rounded-full px-1.5 text-[10px]">
              {items.length}
            </Badge>
          </Button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category_id === cat.id).length
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full"
              >
                {cat.name}
                <Badge variant="secondary" className="ml-1.5 rounded-full px-1.5 text-[10px]">
                  {count}
                </Badge>
              </Button>
            )
          })}
          <Button onClick={openCatAdd} variant="outline" size="sm" className="rounded-full border-dashed border-2 ml-1 hidden sm:flex">
            <PlusIcon className="h-3 w-3 mr-1" /> Category
          </Button>
          <div className="flex gap-2 ml-auto sm:ml-0">
            {selectedCategory && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const cat = categories.find(c => c.id === selectedCategory)
                    if (cat) openCatEdit(cat)
                  }}>
                    <Edit2Icon className="h-4 w-4 mr-2" /> Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    const cat = categories.find(c => c.id === selectedCategory)
                    if (cat) openCatDelete(cat)
                  }} className="text-destructive focus:bg-destructive/10">
                    <Trash2Icon className="h-4 w-4 mr-2 text-destructive" /> Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={openAdd} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Add Card */}
          <button
            onClick={openAdd}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10 p-6 hover:bg-muted/20 hover:border-primary/30 transition-all cursor-pointer group h-[320px] text-center"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Add New Item
            </p>
          </button>

          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-muted">
                {item.image_url ? (
                 <Image
                src={item.image_url}
                alt={item.name}
                fill
               sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                )}
                {/* Stock badge */}
                <div className="absolute bottom-2 left-2">
                  <StatusBadge status={item.stock_status} />
                </div>
                {/* Actions menu */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => openEdit(item)}
                      >
                        <Edit2Icon className="h-4 w-4" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => openDelete(item)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                        Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Info */}
              <CardHeader className="p-4 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-1 leading-snug">
                    {item.name}
                  </CardTitle>
                  <span className="font-bold text-primary text-sm shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-0">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                  {item.description || "No description."}
                </p>
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TagIcon className="h-3 w-3" />
                  {item.category?.name ||
                    categories.find((c) => c.id === item.category_id)?.name ||
                    "Uncategorized"}
                </div>
                <Badge
                  variant={item.is_available ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0 rounded-full"
                >
                  {item.is_available ? "Available" : "Hidden"}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery || selectedCategory ? "No items match your filters" : "No menu items yet"}
          description={
            searchQuery || selectedCategory
              ? "Try clearing filters or searching with a different term."
              : "Add your first menu item to get started."
          }
          actionLabel={searchQuery || selectedCategory ? "Clear Filters" : "Add First Item"}
          onAction={
            searchQuery || selectedCategory
              ? () => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }
              : openAdd
          }
          icon={<LayoutGridIcon className="h-12 w-12" />}
        />
      )}

      {/* Add/Edit Dialog */}
      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        categories={categories}
      />

      {/* Delete Confirm Dialog */}
      {deletingItem && (
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          itemName={deletingItem.name}
        />
      )}
      {/* Category Dialogs */}
      <CategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={editingCat}
      />
      <ConfirmDeleteDialog
        open={catDeleteOpen}
        onOpenChange={setCatDeleteOpen}
        onConfirm={handleCatDelete}
        itemName={deletingCat?.name ?? ""}
      />
    </>
  )
}
