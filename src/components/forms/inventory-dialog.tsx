"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { upsertInventoryItem } from "@/lib/dashboard/actions"
import type { InventoryItem } from "@/lib/dashboard/types"

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  id: z.string().optional(),
  item_name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  reorder_level: z.coerce.number().min(0),
  category: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

const UNITS = ["pcs", "kg", "g", "L", "mL", "boxes", "bags", "bottles", "cups", "packets"]
const CATEGORIES = ["Dairy", "Beverages", "Dry Goods", "Produce", "Bakery", "Packaging", "Cleaning", "Other"]

// ─── Props ────────────────────────────────────────────────────────────────────

interface InventoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryDialog({ open, onOpenChange, item }: InventoryDialogProps) {
  const router = useRouter()
  const isEditing = !!item?.id
  const [isPending, setIsPending] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      id: item?.id,
      item_name: item?.item_name ?? "",
      quantity: item?.quantity ?? 0,
      unit: item?.unit ?? "pcs",
      reorder_level: item?.reorder_level ?? 10,
      category: item?.category ?? null,
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: item?.id,
        item_name: item?.item_name ?? "",
        quantity: item?.quantity ?? 0,
        unit: item?.unit ?? "pcs",
        reorder_level: item?.reorder_level ?? 10,
        category: item?.category ?? null,
      })
    }
  }, [open, item, form])

  const onSubmit = async (values: FormValues) => {
    setIsPending(true)
    try {
      const result = await upsertInventoryItem(values)
      if (result.success) {
        toast.success(result.message ?? (isEditing ? "Item updated" : "Item added to inventory"))
        router.refresh()
        onOpenChange(false)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Inventory Item" : "Add Inventory Item"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing ? "Form to edit an existing inventory item." : "Form to add a new inventory item."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="item_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="item_name">Item Name *</FormLabel>
                  <FormControl>
                    <Input id="item_name" autoComplete="off" placeholder="e.g. Whole Milk, Coffee Beans" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity + Unit */}
            <div className="grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="quantity">Current Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNITS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reorder Level + Category */}
            <div className="grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name="reorder_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="reorder_level">Reorder Level</FormLabel>
                    <FormControl>
                      <Input
                        id="reorder_level"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="10"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "__none" ? null : val)
                      }
                      value={field.value ?? "__none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none">No category</SelectItem>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Saving…
                  </>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Add to Inventory"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
